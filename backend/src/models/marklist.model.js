import mongoose, { Schema } from "mongoose";

const markListSchema = new Schema({
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student', 
      required: true 
    },
    batchId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Batch', 
      required: true 
    },
    semesterId: {
       type: Schema.Types.ObjectId, 
       ref: 'Semester', 
       required: true 
    },
    cicNumber: {
      type: Number,
      required: true
    },
    subjects: [],
    isApproved: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    editingStatus: {
      type: String,
      enum: ["send", "allow", "disable"], 
      default: "disable"
    }
    

  },
  { timestamps: true }
);
  
  markListSchema.index({ cicNumber: 1 });
  
  export default mongoose.model('Marklist', markListSchema);
  