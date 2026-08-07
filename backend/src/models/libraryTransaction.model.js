import mongoose from "mongoose";

const LibraryTransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, default: "student" },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['active', 'returned'], default: 'active' },
}, { timestamps: true });

export default mongoose.model("LibraryTransaction", LibraryTransactionSchema);
