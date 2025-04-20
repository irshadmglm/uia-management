import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bookNumber: { type: Number, required: true, unique: true },
  author: { type: String, required: true },
  status: { type: String, default: "available" },
  borrowedBy: { type: String, default: null },
  studentName: { type: String, default: null },
  dueDate: { type: Date, default: null },
});

export default mongoose.model("Book", BookSchema);

