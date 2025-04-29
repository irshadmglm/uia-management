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
    currentSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
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
    }
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
