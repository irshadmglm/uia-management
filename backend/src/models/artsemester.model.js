import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtSubject",
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("ArtSemester", semesterSchema);
