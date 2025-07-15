import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    classLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    classLeader2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    currentSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    currentArtSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtSemester",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    attendance: {
      type: Object,
      default: {},
    },    
    CEmarkList: {
      type: String,
      default: null,
    },
    IRmarkList: {
      type: String,
      default: null,
    },
    stdAttendanceRegister: {
      type: String,
      default: null,
    },
    staffAttendanceRegister: {
      type: String,
      default: null,
    },
    subjectStatus: {
      type: String,
      default: null,
    },
    ceStatus: {
      type: String,
      default: null,
    },
    ishthiraq: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
