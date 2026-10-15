import mongoose, { Schema } from "mongoose";

const attendanceRecordSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      default: "absent",
    },
  },
  { _id: false }
);

const attendanceSchema = new Schema(
  {
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    // Map of { studentId: "present" | "absent" } for immediate frontend compatibility
    attendanceMap: {
      type: Map,
      of: String,
      default: {},
    },
    // Structured records array for analytics, filtering, and reporting
    records: [attendanceRecordSchema],
    takenBy: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
  },
  { timestamps: true }
);

// Compound unique index ensuring one attendance record per batch per calendar day
attendanceSchema.index({ batchId: 1, year: 1, month: 1, day: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
