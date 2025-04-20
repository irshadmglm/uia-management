import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  bookNumber: { type: Number, required: true },
  borrowDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  studentId: { type: String, required: true },
  returned: { type: Boolean, default: false },
  returnDate: { type: Date, default: null },
});

export default mongoose.model("Transaction", TransactionSchema);
