import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  bookNumber: { type: Number, required: true, unique: true },
  author: { type: String, required: true, index: true },
  category: { type: String, default: "General", index: true },
  callNumber: { type: String, default: "" },
  publisher: { type: String, default: "" },
  volume: { type: String, default: "" },
  price: { type: Number, default: 0 },
  remarks: { type: String, default: "" },
  status: { type: String, default: "available", index: true },
  borrowedBy: { type: String, default: null },
  studentName: { type: String, default: null },
  issueDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("Book", BookSchema);

