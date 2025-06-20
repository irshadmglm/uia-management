import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  bookName: {
    type: String,
    required: true
  },
  authorName: {
    type: String
  },
  publisher: {
    type: String
  },
  numberOfPages: {
    type: Number
  },
  monthAndYear: {
    type: String
  },
  approval: {
    type: Boolean,
    default: false
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model("ReadingProgress", readingProgressSchema);
