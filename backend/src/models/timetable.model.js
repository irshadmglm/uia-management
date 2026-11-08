import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {},
  { strict: false, _id: false } // Allows dynamic keys like batch names
);

const timetableSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
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
    teacherName: {
      type: String,
      default: "",
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
    room: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const timetableSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Master Timetable",
      trim: true,
    },
    grid: {
      type: Object,
      default: {},
    },
    slots: {
      type: [timetableSlotSchema],
      default: [],
    },
    metadata: {
      weekdays: {
        type: [String],
        default: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      },
      periodsCount: {
        type: Number,
        default: 4,
      },
      periodTimes: {
        type: [String],
        default: [],
      },
      importedAt: {
        type: Date,
        default: null,
      },
      version: {
        type: String,
        default: "1.0",
      },
    },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Timetable", timetableSchema);
