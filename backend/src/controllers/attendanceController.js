import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Attendance from "../models/attendance.model.js";

export const postAttendance = async (req, res) => {
  try {
    let { attendance, classId, date } = req.body;

    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }

    date = date ? new Date(date) : new Date();
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const year = date.getFullYear();
    const monthName = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();

    // 1. Structured records array for queryability
    const records = [];
    if (attendance && typeof attendance === "object") {
      for (const [studentId, status] of Object.entries(attendance)) {
        if (mongoose.Types.ObjectId.isValid(studentId)) {
          records.push({ studentId, status: status === "present" ? "present" : "absent" });
        }
      }
    }

    // 2. Structured write to dedicated Attendance collection (with year!)
    await Attendance.findOneAndUpdate(
      { batchId: classId, year, month: monthName, day },
      {
        $set: {
          batchId: classId,
          date,
          year,
          month: monthName,
          day,
          attendanceMap: attendance,
          records,
        },
      },
      { upsert: true, new: true }
    );

    // 3. Legacy write to Batch document for backward compatibility
    await Batch.updateOne(
      { _id: classId },
      { $set: { [`attendance.${monthName}.${day}`]: attendance } }
    );

    res.status(200).json({ message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Error in postAttendance:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ error: "classId and date are required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const year = parsedDate.getFullYear();
    const monthName = parsedDate.toLocaleString("default", { month: "long" });
    const day = parsedDate.getDate();

    // 1. Try reading from structured Attendance collection first
    const doc = await Attendance.findOne({ batchId: classId, year, month: monthName, day });
    if (doc && doc.attendanceMap) {
      const attendance = doc.attendanceMap instanceof Map
        ? Object.fromEntries(doc.attendanceMap)
        : doc.attendanceMap;
      return res.status(200).json({ date, attendance });
    }

    // 2. Fallback to legacy Batch.attendance
    const classData = await Batch.findOne(
      { _id: classId },
      { [`attendance.${monthName}.${day}`]: 1, _id: 0 }
    );

    if (!classData) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const attendance = classData.attendance?.[monthName]?.[day] || {};
    res.status(200).json({ date, attendance });
  } catch (error) {
    console.error("Error in getAttendance:", error);
    res.status(500).json({ error: error.message });
  }
};
