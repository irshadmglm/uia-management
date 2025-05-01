import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  batchName: {
    type: String,
    required: true,
    trim: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Batch"
  },
  cicNumber: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  whatsupNumber: {
    type: Number,
    trim: true,
  },
  parentNumber: {
    type: Number,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  email: {
    type: String,
    trim: true,
},
  address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default:"student"
  }
},
{ timestamps: true }
);

export default mongoose.model("Student", UserSchema);



  