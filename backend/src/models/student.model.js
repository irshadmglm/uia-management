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
    type: Number,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: mongoose.Schema.Types.Mixed,
    trim: true,
  },
  whatsupNumber: {
    type: mongoose.Schema.Types.Mixed,
    trim: true,
  },
  parentNumber: {
    type: mongoose.Schema.Types.Mixed,
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
  parentPassword: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default:"student"
  },
  
isActive: {
  type: Boolean,
  default: true
}
},
{ timestamps: true }
);

export default mongoose.model("Student", UserSchema);



  