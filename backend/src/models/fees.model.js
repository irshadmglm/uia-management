
import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  paid: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Fee', feeSchema);