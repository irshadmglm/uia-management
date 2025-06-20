import mongoose from "mongoose";

const achivementSchema = new mongoose.Schema(
  {
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student"
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch"
  },
  achievedItem: {
    type: String,
    required: true
  },
  agencyLevel: {
    type: String
  },
  placeOrRank: {
    type: String
  },
  gradeOrPercentage: {
    type: String
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

export default mongoose.model("Achivement", achivementSchema);



  