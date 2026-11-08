import TeacherAttendance from "../models/teacherAttendance.model.js";
import Timetable from "../models/timetable.model.js";
import Staff from "../models/staff.model.js";

/**
 * Returns weekday name for a date string (YYYY-MM-DD)
 */
export const getDayNameFromDateString = (dateString) => {
  if (!dateString) return "Monday";
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
};

/**
 * Recalculates summary counts for a teacher attendance document
 */
const computeAttendanceSummary = (records = []) => {
  let presentCount = 0;
  let absentCount = 0;
  let substitutedCount = 0;
  let unmarkedCount = 0;

  records.forEach((r) => {
    if (r.isSubstituted) {
      substitutedCount += 1;
    }
    if (r.status === "present") {
      presentCount += 1;
    } else if (r.status === "absent") {
      absentCount += 1;
    } else if (r.status === "unmarked") {
      unmarkedCount += 1;
    }
  });

  return {
    totalSlots: records.length,
    presentCount,
    absentCount,
    substitutedCount,
    unmarkedCount,
  };
};

/**
 * GET /api/management/teacher-attendance?date=YYYY-MM-DD
 * Retrieves or initializes period-based teacher attendance for a specific date
 */
export const getTeacherAttendance = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const dateString = req.query.date || todayStr;
    const dayName = getDayNameFromDateString(dateString);

    let doc = await TeacherAttendance.findOne({ dateString })
      .populate("records.scheduledTeacherId", "name userName profileImage phoneNumber")
      .populate("records.attendedTeacherId", "name userName profileImage phoneNumber");

    if (doc) {
      return res.status(200).json({
        success: true,
        attendance: doc,
        dayName,
        isNew: false,
      });
    }

    // If not found, load active timetable to initialize default periods for this day
    const timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    if (!timetable || !Array.isArray(timetable.slots) || timetable.slots.length === 0) {
      return res.status(200).json({
        success: true,
        attendance: {
          dateString,
          date: new Date(dateString),
          dayName,
          periodsCount: 4,
          records: [],
          summary: {
            totalSlots: 0,
            presentCount: 0,
            absentCount: 0,
            substitutedCount: 0,
            unmarkedCount: 0,
          },
        },
        dayName,
        isNew: true,
        message: "No timetable slots found in database. Please import a timetable first.",
      });
    }

    // Filter slots matching day of the week
    const targetDayLower = dayName.trim().toLowerCase();
    const daySlots = timetable.slots.filter(
      (s) => s.day && s.day.trim().toLowerCase() === targetDayLower
    );

    // If no slots configured for this day
    if (daySlots.length === 0) {
      return res.status(200).json({
        success: true,
        attendance: {
          dateString,
          date: new Date(dateString),
          dayName,
          periodsCount: timetable.metadata?.periodsCount || 4,
          records: [],
          summary: {
            totalSlots: 0,
            presentCount: 0,
            absentCount: 0,
            substitutedCount: 0,
            unmarkedCount: 0,
          },
        },
        dayName,
        isNew: true,
        message: `No classes scheduled in timetable for ${dayName}.`,
      });
    }

    // Sort slots by period ascending, then batchName
    daySlots.sort((a, b) => {
      if (a.period !== b.period) return a.period - b.period;
      return (a.batchName || "").localeCompare(b.batchName || "");
    });

    // Build initial records
    const initialRecords = daySlots.map((s) => ({
      period: s.period,
      batchName: s.batchName,
      batchId: s.batchId || null,
      subjectName: s.subjectName,
      subjectCode: s.subjectCode || "",
      room: s.room || "",
      scheduledTeacherId: s.teacherId || null,
      scheduledTeacherName: s.teacherName || "",
      status: "unmarked",
      attendedTeacherId: s.teacherId || null,
      attendedTeacherName: s.teacherName || "",
      isSubstituted: false,
      remarks: "",
    }));

    const summary = computeAttendanceSummary(initialRecords);

    // Persist initialized record
    const newDoc = await TeacherAttendance.create({
      dateString,
      date: new Date(dateString),
      dayName,
      periodsCount: timetable.metadata?.periodsCount || 4,
      records: initialRecords,
      summary,
    });

    const populated = await TeacherAttendance.findById(newDoc._id)
      .populate("records.scheduledTeacherId", "name userName profileImage phoneNumber")
      .populate("records.attendedTeacherId", "name userName profileImage phoneNumber");

    return res.status(200).json({
      success: true,
      attendance: populated,
      dayName,
      isNew: true,
    });
  } catch (error) {
    console.error("Error in getTeacherAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher attendance: " + error.message,
    });
  }
};

/**
 * PATCH /api/management/teacher-attendance/slot
 * Updates a single period slot (attendance status, proxy teacher substitution, remarks)
 */
export const updateTeacherAttendanceSlot = async (req, res) => {
  try {
    const {
      dateString,
      recordId,
      status,
      attendedTeacherId,
      attendedTeacherName,
      remarks,
    } = req.body;

    if (!dateString || !recordId) {
      return res.status(400).json({
        success: false,
        message: "dateString and recordId are required.",
      });
    }

    const doc = await TeacherAttendance.findOne({ dateString });
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Attendance document not found for date " + dateString,
      });
    }

    const record = doc.records.id(recordId);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record slot not found.",
      });
    }

    if (status !== undefined) {
      record.status = status;
    }

    if (attendedTeacherName !== undefined) {
      record.attendedTeacherName = attendedTeacherName.trim();
      record.attendedTeacherId = attendedTeacherId || null;

      // Check if substituted: if attended teacher differs from scheduled teacher
      const schedId = record.scheduledTeacherId ? String(record.scheduledTeacherId) : "";
      const attId = attendedTeacherId ? String(attendedTeacherId) : "";
      const schedName = (record.scheduledTeacherName || "").trim().toLowerCase();
      const attName = (attendedTeacherName || "").trim().toLowerCase();

      const isDiff = (attId && schedId && attId !== schedId) || (attName && schedName && attName !== schedName);
      record.isSubstituted = Boolean(isDiff);

      // If substitution was made and status was still unmarked, auto-set to present
      if (isDiff && (record.status === "unmarked" || !record.status)) {
        record.status = "present";
      }
    }

    if (remarks !== undefined) {
      record.remarks = remarks;
    }

    record.markedAt = new Date();
    doc.summary = computeAttendanceSummary(doc.records);

    await doc.save();

    const populated = await TeacherAttendance.findById(doc._id)
      .populate("records.scheduledTeacherId", "name userName profileImage phoneNumber")
      .populate("records.attendedTeacherId", "name userName profileImage phoneNumber");

    return res.status(200).json({
      success: true,
      message: "Slot attendance updated successfully.",
      attendance: populated,
    });
  } catch (error) {
    console.error("Error in updateTeacherAttendanceSlot:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update slot: " + error.message,
    });
  }
};

/**
 * POST /api/management/teacher-attendance/bulk-mark
 * Bulk mark actions (e.g. mark all present, mark period present, reset defaults)
 */
export const bulkMarkTeacherAttendance = async (req, res) => {
  try {
    const { dateString, action, period } = req.body;

    if (!dateString) {
      return res.status(400).json({ success: false, message: "dateString is required." });
    }

    const doc = await TeacherAttendance.findOne({ dateString });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Attendance record not found for date." });
    }

    const now = new Date();

    if (action === "mark_all_present") {
      doc.records.forEach((r) => {
        r.status = "present";
        r.markedAt = now;
      });
    } else if (action === "mark_all_absent") {
      doc.records.forEach((r) => {
        r.status = "absent";
        r.markedAt = now;
      });
    } else if (action === "mark_period_present" && period !== undefined) {
      doc.records.forEach((r) => {
        if (r.period === Number(period)) {
          r.status = "present";
          r.markedAt = now;
        }
      });
    } else if (action === "reset_defaults") {
      doc.records.forEach((r) => {
        r.status = "unmarked";
        r.attendedTeacherId = r.scheduledTeacherId;
        r.attendedTeacherName = r.scheduledTeacherName;
        r.isSubstituted = false;
        r.remarks = "";
        r.markedAt = null;
      });
    }

    doc.summary = computeAttendanceSummary(doc.records);
    await doc.save();

    const populated = await TeacherAttendance.findById(doc._id)
      .populate("records.scheduledTeacherId", "name userName profileImage phoneNumber")
      .populate("records.attendedTeacherId", "name userName profileImage phoneNumber");

    return res.status(200).json({
      success: true,
      message: "Bulk action applied successfully.",
      attendance: populated,
    });
  } catch (error) {
    console.error("Error in bulkMarkTeacherAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to perform bulk mark: " + error.message,
    });
  }
};

/**
 * POST /api/management/teacher-attendance/save-day
 * Saves the entire day's records at once
 */
export const saveDailyTeacherAttendance = async (req, res) => {
  try {
    const { dateString, records, notes } = req.body;

    if (!dateString || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "dateString and records array are required.",
      });
    }

    const summary = computeAttendanceSummary(records);
    const dayName = getDayNameFromDateString(dateString);

    const updated = await TeacherAttendance.findOneAndUpdate(
      { dateString },
      {
        $set: {
          date: new Date(dateString),
          dayName,
          records,
          summary,
          notes: notes || "",
        },
      },
      { new: true, upsert: true }
    )
      .populate("records.scheduledTeacherId", "name userName profileImage phoneNumber")
      .populate("records.attendedTeacherId", "name userName profileImage phoneNumber");

    return res.status(200).json({
      success: true,
      message: "Daily teacher attendance saved successfully.",
      attendance: updated,
    });
  } catch (error) {
    console.error("Error in saveDailyTeacherAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save teacher attendance: " + error.message,
    });
  }
};

/**
 * GET /api/management/teacher-attendance/monthly-summary?year=2026&month=11
 * Monthly analytics and per-teacher breakdown
 */
export const getTeacherAttendanceMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const regexPattern = new RegExp(`^${year}-${monthStr}-`);

    const dailyDocs = await TeacherAttendance.find({
      dateString: { $regex: regexPattern },
    })
      .populate("records.scheduledTeacherId", "name userName profileImage")
      .populate("records.attendedTeacherId", "name userName profileImage");

    let totalDaysTracked = dailyDocs.length;
    let totalScheduledPeriods = 0;
    let totalPresentPeriods = 0;
    let totalAbsentPeriods = 0;
    let totalSubstitutedPeriods = 0;

    // Per-teacher map
    const teacherMap = {};

    dailyDocs.forEach((doc) => {
      doc.records.forEach((r) => {
        totalScheduledPeriods += 1;
        if (r.status === "present") totalPresentPeriods += 1;
        if (r.status === "absent") totalAbsentPeriods += 1;
        if (r.isSubstituted) totalSubstitutedPeriods += 1;

        // Track scheduled teacher stats
        const schedId = r.scheduledTeacherId?._id?.toString() || r.scheduledTeacherName || "Unknown";
        const schedName = r.scheduledTeacherId?.name || r.scheduledTeacherName || "Unknown";

        if (!teacherMap[schedId]) {
          teacherMap[schedId] = {
            id: schedId,
            name: schedName,
            scheduledCount: 0,
            presentCount: 0,
            absentCount: 0,
            substitutesGiven: 0,
            substitutesTaken: 0,
          };
        }
        teacherMap[schedId].scheduledCount += 1;
        if (r.status === "present" && !r.isSubstituted) {
          teacherMap[schedId].presentCount += 1;
        } else if (r.status === "absent") {
          teacherMap[schedId].absentCount += 1;
        } else if (r.isSubstituted) {
          teacherMap[schedId].substitutesGiven += 1; // Another teacher substituted for them
        }

        // Track attended/proxy teacher stats if substituted
        if (r.isSubstituted && r.attendedTeacherName) {
          const attId = r.attendedTeacherId?._id?.toString() || r.attendedTeacherName;
          const attName = r.attendedTeacherId?.name || r.attendedTeacherName;
          if (!teacherMap[attId]) {
            teacherMap[attId] = {
              id: attId,
              name: attName,
              scheduledCount: 0,
              presentCount: 0,
              absentCount: 0,
              substitutesGiven: 0,
              substitutesTaken: 0,
            };
          }
          teacherMap[attId].substitutesTaken += 1;
        }
      });
    });

    const teacherStats = Object.values(teacherMap).map((t) => {
      const totalDuty = t.presentCount + t.substitutesTaken;
      const rate = t.scheduledCount > 0 ? Math.round((t.presentCount / t.scheduledCount) * 100) : 100;
      return {
        ...t,
        attendanceRate: rate,
        totalClassesConducted: totalDuty,
      };
    });

    teacherStats.sort((a, b) => b.scheduledCount - a.scheduledCount);

    return res.status(200).json({
      success: true,
      year,
      month,
      totalDaysTracked,
      overview: {
        totalScheduledPeriods,
        totalPresentPeriods,
        totalAbsentPeriods,
        totalSubstitutedPeriods,
        attendanceRate:
          totalScheduledPeriods > 0
            ? Math.round((totalPresentPeriods / totalScheduledPeriods) * 100)
            : 0,
      },
      teacherStats,
    });
  } catch (error) {
    console.error("Error in getTeacherAttendanceMonthlySummary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate monthly summary: " + error.message,
    });
  }
};

