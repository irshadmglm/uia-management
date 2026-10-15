import mongoose, { Schema } from "mongoose";

const subjectMarkItemSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    mark: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 100,
    },
    ceMarks: {
      type: Number,
      default: 0,
    },
  },
  { _id: false, strict: false }
);

const markListSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    semesterId: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    cicNumber: {
      type: Number,
      required: true,
    },
    subjects: [subjectMarkItemSchema],
    isApproved: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    editingStatus: {
      type: String,
      enum: ["send", "allow", "disable"],
      default: "disable",
    },
  },
  { timestamps: true }
);

markListSchema.index({ cicNumber: 1 });
markListSchema.index({ studentId: 1, semesterId: 1 });
markListSchema.index({ batchId: 1, semesterId: 1 });

export default mongoose.model("Marklist", markListSchema);