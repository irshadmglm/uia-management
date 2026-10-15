import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // 'academic' = regular semester, 'art' = art track semester
    // This field allows us to store both in one collection (merged from ArtSemester)
    type: {
      type: String,
      enum: ['academic', 'art'],
      default: 'academic',
    },
    academicYear: {
      type: String,  // e.g. "2024-2025"
      default: null,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Semester", semesterSchema);
