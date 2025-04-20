import mongoose from "mongoose";

const RegisteredUserSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    selectedBatch: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch"
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    isSelected: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true } 
);

RegisteredUserSchema.index({ selectedBatch: 1 });

export default mongoose.model('RegisteredUser', RegisteredUserSchema);

