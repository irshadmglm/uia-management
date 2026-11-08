import mongoose from "mongoose";
import Timetable from "../models/timetable.model.js";
import Batch from "../models/batch.model.js";
import Staff from "../models/staff.model.js";

const DEFAULT_WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

/**
 * Standardize day representation to title-case weekday string.
 * Supports: 0..6 (based on Saturday/Monday), or strings like "mon", "monday", "Saturday".
 */
export const normalizeDayName = (dayInput, weekdaysList = DEFAULT_WEEKDAYS) => {
  if (typeof dayInput === "number") {
    // If index within provided weekdays
    if (dayInput >= 0 && dayInput < weekdaysList.length) {
      return weekdaysList[dayInput];
    }
    // Default fallback index mapping
    const standardDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return standardDays[dayInput % standardDays.length];
  }

  if (typeof dayInput === "string") {
    const trimmed = dayInput.trim().toLowerCase();
    const map = {
      sat: "Saturday",
      saturday: "Saturday",
      sun: "Sunday",
      sunday: "Sunday",
      mon: "Monday",
      monday: "Monday",
      tue: "Tuesday",
      tues: "Tuesday",
      tuesday: "Tuesday",
      wed: "Wednesday",
      wednesday: "Wednesday",
      thu: "Thursday",
      thur: "Thursday",
      thurs: "Thursday",
      thursday: "Thursday",
      fri: "Friday",
      friday: "Friday",
    };
    return map[trimmed] || dayInput;
  }

  return "Saturday";
};

/**
 * GET /api/mng/timetable
 */
export const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    const batches = await Batch.find({ isActive: { $ne: false } });

    if (!timetable) {
      const weekdays = DEFAULT_WEEKDAYS;
      const periodCount = 4;

      const createEmptySlot = () =>
        Object.fromEntries(batches.map((b) => [b.name, null]));

      const grid = {};
      weekdays.forEach((day) => {
        grid[day] = Array.from({ length: periodCount }, createEmptySlot);
      });

      timetable = new Timetable({
        title: "Master Timetable",
        grid,
        slots: [],
        metadata: {
          weekdays,
          periodsCount: periodCount,
          periodTimes: ["08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM"],
          importedAt: null,
        },
      });
      await timetable.save();
    }

    res.status(200).json({ status: true, timetable });
  } catch (error) {
    console.error("Error in getTimetable:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * POST /api/mng/timetable
 */
export const postTimetable = async (req, res) => {
  try {
    const { grid, slots, metadata, title } = req.body;

    let timetable = await Timetable.findOne().sort({ updatedAt: -1 });

    if (!timetable) {
      timetable = new Timetable({
        title: title || "Master Timetable",
        grid: grid || {},
        slots: slots || [],
        metadata: metadata || {},
      });
    } else {
      if (grid !== undefined) timetable.grid = grid;
      if (slots !== undefined) timetable.slots = slots;
      if (metadata !== undefined) timetable.metadata = { ...timetable.metadata, ...metadata };
      if (title !== undefined) timetable.title = title;
    }

    await timetable.save();
    res.status(200).json({ status: true, message: "Timetable updated", timetable });
  } catch (error) {
    console.error("Error in postTimetable:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * POST /api/mng/timetable/import
 * Imports timetable from external tool with teacher & batch mappings.
 */
export const importTimetable = async (req, res) => {
  try {
    const {
      slots: rawSlots = [],
      teacherMappings = {}, // { "Imported Teacher Name": "StaffObjectId" }
      batchMappings = {},   // { "Imported Class Name": "BatchObjectId" }
      metadata = {},
      title = "Imported Timetable",
    } = req.body;

    if (!Array.isArray(rawSlots) || rawSlots.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No timetable slots provided to import.",
      });
    }

    // Pre-fetch all active staff & batches to map quickly
    const staffList = await Staff.find({ role: "teacher" }).select("_id name");
    const staffMap = new Map(staffList.map((s) => [String(s._id), s.name]));

    const batchList = await Batch.find().select("_id name");
    const batchIdMap = new Map(batchList.map((b) => [String(b._id), b.name]));
    const batchNameMap = new Map(batchList.map((b) => [b.name.trim().toLowerCase(), b]));

    const weekdays =
      Array.isArray(metadata?.weekdays) && metadata.weekdays.length > 0
        ? metadata.weekdays
        : DEFAULT_WEEKDAYS;

    // Process & normalize each slot
    let maxPeriod = 0;
    const normalizedSlots = [];

    rawSlots.forEach((slot) => {
      if (!slot) return;

      const rawDay = slot.day_name || (slot.day !== undefined ? slot.day : 0);
      const day = normalizeDayName(rawDay, weekdays);
      const period = typeof slot.period === "number" ? slot.period : parseInt(slot.period, 10) || 0;
      if (period > maxPeriod) maxPeriod = period;

      // Batch resolution
      const rawClassName = String(slot.class_name || slot.class_id || "").trim();
      const mappedBatchId = batchMappings[rawClassName] || null;
      let resolvedBatchName = rawClassName;
      let resolvedBatchObjectId = null;

      if (mappedBatchId && batchIdMap.has(String(mappedBatchId))) {
        resolvedBatchObjectId = new mongoose.Types.ObjectId(mappedBatchId);
        resolvedBatchName = batchIdMap.get(String(mappedBatchId));
      } else if (batchNameMap.has(rawClassName.toLowerCase())) {
        const found = batchNameMap.get(rawClassName.toLowerCase());
        resolvedBatchObjectId = found._id;
        resolvedBatchName = found.name;
      }

      // Teacher resolution
      const rawTeacherName = String(slot.teacher_name || slot.teacher_id || "").trim();
      const mappedTeacherId = teacherMappings[rawTeacherName] || null;
      let resolvedTeacherName = rawTeacherName;
      let resolvedTeacherObjectId = null;

      if (mappedTeacherId && staffMap.has(String(mappedTeacherId))) {
        resolvedTeacherObjectId = new mongoose.Types.ObjectId(mappedTeacherId);
        resolvedTeacherName = staffMap.get(String(mappedTeacherId));
      }

      const subjectName = String(slot.subject_name || slot.subject_id || "Subject").trim();
      const subjectCode = String(slot.subject_code || "").trim();
      const room = String(slot.room || "").trim();
      const color = String(slot.subject_color || slot.color || "").trim();

      normalizedSlots.push({
        day,
        period,
        batchName: resolvedBatchName || "Class",
        batchId: resolvedBatchObjectId,
        subjectName,
        subjectCode,
        teacherName: resolvedTeacherName,
        teacherId: resolvedTeacherObjectId,
        room,
        color,
      });
    });

    const periodsCount = Math.max(maxPeriod + 1, metadata?.periodsCount || 4);

    // Build 2D grid structure for master view: { [day]: Array(periodsCount) of { [batchName]: slotData } }
    const grid = {};
    weekdays.forEach((day) => {
      grid[day] = Array.from({ length: periodsCount }, () => ({}));
    });

    normalizedSlots.forEach((slot) => {
      if (!grid[slot.day]) {
        grid[slot.day] = Array.from({ length: periodsCount }, () => ({}));
      }
      if (grid[slot.day][slot.period]) {
        grid[slot.day][slot.period][slot.batchName] = {
          subject: slot.subjectName,
          subjectCode: slot.subjectCode,
          teacher: slot.teacherName,
          teacherId: slot.teacherId,
          batchId: slot.batchId,
          room: slot.room,
          color: slot.color,
        };
      }
    });

    // Save or update Timetable document
    let timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    const finalMetadata = {
      weekdays,
      periodsCount,
      periodTimes: Array.isArray(metadata?.periodTimes) ? metadata.periodTimes : [],
      importedAt: new Date(),
      importedBy: req.user?._id || null,
      version: metadata?.version || "1.0",
    };

    if (!timetable) {
      timetable = new Timetable({
        title,
        grid,
        slots: normalizedSlots,
        metadata: finalMetadata,
      });
    } else {
      timetable.title = title || timetable.title;
      timetable.grid = grid;
      timetable.slots = normalizedSlots;
      timetable.metadata = finalMetadata;
    }

    await timetable.save();

    res.status(200).json({
      status: true,
      message: `Successfully imported ${normalizedSlots.length} timetable slots!`,
      slotsCount: normalizedSlots.length,
      periodsCount,
      timetable,
    });
  } catch (error) {
    console.error("Error in importTimetable:", error);
    res.status(500).json({
      status: false,
      message: "Failed to import timetable",
      error: error.message,
    });
  }
};

/**
 * GET /api/mng/timetable/teacher/:teacherId
 * Retrieves weekly timetable schedule for a specific teacher.
 */
export const getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Staff.findById(teacherId).select("name role userName profileImage");
    if (!teacher) {
      return res.status(404).json({ status: false, message: "Teacher not found" });
    }

    const timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    if (!timetable || !timetable.slots || timetable.slots.length === 0) {
      return res.status(200).json({
        status: true,
        teacher,
        slots: [],
        scheduleByDay: {},
        totalPeriods: 0,
      });
    }

    // Match by teacherId (ObjectId) OR by teacher's name (case-insensitive)
    const teacherNameLower = (teacher.name || "").trim().toLowerCase();
    const teacherSlots = timetable.slots.filter(
      (s) =>
        (s.teacherId && String(s.teacherId) === String(teacherId)) ||
        (s.teacherName && s.teacherName.trim().toLowerCase() === teacherNameLower)
    );

    // Group slots by weekday
    const weekdays = timetable.metadata?.weekdays || DEFAULT_WEEKDAYS;
    const scheduleByDay = {};
    weekdays.forEach((day) => {
      scheduleByDay[day] = [];
    });

    teacherSlots.forEach((slot) => {
      if (!scheduleByDay[slot.day]) {
        scheduleByDay[slot.day] = [];
      }
      scheduleByDay[slot.day].push(slot);
    });

    // Sort slots by period ascending
    Object.keys(scheduleByDay).forEach((day) => {
      scheduleByDay[day].sort((a, b) => a.period - b.period);
    });

    // Compute unique batches and subjects taught
    const uniqueBatches = [...new Set(teacherSlots.map((s) => s.batchName))].filter(Boolean);
    const uniqueSubjects = [...new Set(teacherSlots.map((s) => s.subjectName))].filter(Boolean);

    res.status(200).json({
      status: true,
      teacher,
      slots: teacherSlots,
      scheduleByDay,
      totalPeriods: teacherSlots.length,
      uniqueBatches,
      uniqueSubjects,
      periodTimes: timetable.metadata?.periodTimes || [],
      periodsCount: timetable.metadata?.periodsCount || 4,
    });
  } catch (error) {
    console.error("Error in getTeacherTimetable:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * GET /api/mng/timetable/batch/:batchId
 * Retrieves weekly timetable schedule for a specific batch.
 */
export const getBatchTimetable = async (req, res) => {
  try {
    const { batchId } = req.params;

    let batch = null;
    if (mongoose.Types.ObjectId.isValid(batchId)) {
      batch = await Batch.findById(batchId).select("name currentSemester");
    }

    const timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    if (!timetable || !timetable.slots) {
      return res.status(200).json({
        status: true,
        batch,
        slots: [],
        scheduleByDay: {},
      });
    }

    const batchNameLower = batch?.name ? batch.name.trim().toLowerCase() : batchId.trim().toLowerCase();

    const batchSlots = timetable.slots.filter(
      (s) =>
        (s.batchId && String(s.batchId) === String(batchId)) ||
        (s.batchName && s.batchName.trim().toLowerCase() === batchNameLower)
    );

    const weekdays = timetable.metadata?.weekdays || DEFAULT_WEEKDAYS;
    const scheduleByDay = {};
    weekdays.forEach((day) => {
      scheduleByDay[day] = [];
    });

    batchSlots.forEach((slot) => {
      if (!scheduleByDay[slot.day]) {
        scheduleByDay[slot.day] = [];
      }
      scheduleByDay[slot.day].push(slot);
    });

    Object.keys(scheduleByDay).forEach((day) => {
      scheduleByDay[day].sort((a, b) => a.period - b.period);
    });

    res.status(200).json({
      status: true,
      batch,
      slots: batchSlots,
      scheduleByDay,
      periodTimes: timetable.metadata?.periodTimes || [],
      periodsCount: timetable.metadata?.periodsCount || 4,
    });
  } catch (error) {
    console.error("Error in getBatchTimetable:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * DELETE /api/mng/timetable/clear
 * Clears current timetable slots.
 */
export const clearTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne().sort({ updatedAt: -1 });
    if (timetable) {
      timetable.slots = [];
      const batches = await Batch.find({ isActive: { $ne: false } });
      const weekdays = timetable.metadata?.weekdays || DEFAULT_WEEKDAYS;
      const periodsCount = timetable.metadata?.periodsCount || 4;

      const createEmptySlot = () => Object.fromEntries(batches.map((b) => [b.name, null]));
      const grid = {};
      weekdays.forEach((day) => {
        grid[day] = Array.from({ length: periodsCount }, createEmptySlot);
      });

      timetable.grid = grid;
      await timetable.save();
    }
    res.status(200).json({ status: true, message: "Timetable cleared successfully" });
  } catch (error) {
    console.error("Error in clearTimetable:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};
