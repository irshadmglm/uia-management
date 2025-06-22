import mongoose from "mongoose";
import Semester from "./semester.model.js";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mark: {
      type: Number,
      required: true
    },
    CEmark: {
     type: Boolean,
     default: false
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true, 
    },
    subTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    subTeacher2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    periodTeacher1: {
      type: Number,
    },
    periodTeacher2: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

subjectSchema.pre("save", async function (next) {
  if (!this.code) {
    try {
      const semesterId = this.semester;  
      const semester = await Semester.findById(semesterId); 
      if (!semester) {
        throw new Error("Semester not found");
      }

      const namePart = this.name.substring(0, 4).toUpperCase();
      const semesterSufix = semester.name.charAt(semester.name.length - 1); 

      const lastSubject = await mongoose
        .model("Subject")
        .findOne({ code: new RegExp(`^${namePart}\\d{3}$`, "i") })
        .sort({ createdAt: -1 });

      let nextNumber = 10;
      if (lastSubject && lastSubject.code) {
        const lastNumber = parseInt(lastSubject.code.match(/\d+$/), 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      this.code = `${namePart}${nextNumber}${semesterSufix}`;
    } catch (error) {
      return next(error); 
    }
  }
  next();
});

export default mongoose.model("Subject", subjectSchema);
