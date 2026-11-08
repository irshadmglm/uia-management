import mongoose from "mongoose";

const teacherAttendanceSlotSchema = new mongoose.Schema(
  {
    period: {
      type: Number,
      required: true,
    },
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      default: "",
      trim: true,
    },
    room: {
      type: String,
      default: "",
      trim: true,
    },
    scheduledTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
    scheduledTeacherName: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["unmarked", "present", "absent", "substituted", "cancelled"],
      default: "unmarked",
    },
    attendedTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
    attendedTeacherName: {
      type: String,
      default: "",
      trim: true,
    },
    isSubstituted: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    markedAt: {
      type: Date,
      default: null,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
  },
  { _id: true, timestamps: true }
);

const teacherAttendanceSchema = new mongoose.Schema(
  {
    dateString: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dayName: {
      type: String, // "Saturday", "Sunday", "Monday", etc.
      required: true,
    },
    periodsCount: {
      type: Number,
      default: 4,
    },
    records: [teacherAttendanceSlotSchema],
    summary: {
      totalSlots: { type: Number, default: 0 },
      presentCount: { type: Number, default: 0 },
      absentCount: { type: Number, default: 0 },
      substitutedCount: { type: Number, default: 0 },
      unmarkedCount: { type: Number, default: 0 },
    },
    notes: {
      type: String,
      default: "",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeacherAttendance", teacherAttendanceSchema);

