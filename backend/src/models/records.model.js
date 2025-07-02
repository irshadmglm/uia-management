import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    folder: {
      type: String,
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Record', recordSchema);
