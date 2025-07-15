import mongoose from "mongoose";
import ArtSemester from "./artsemester.model.js";

const artSubjectSchema = new mongoose.Schema(
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
      uppercase: true,
    },
    artSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtSemester",
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

artSubjectSchema.pre("save", async function (next) {
  if (!this.code) {
    try {
      const semesterId = this.artSemester;  
      const semester = await ArtSemester.findById(semesterId); 
      if (!semester) {
        throw new Error("Semester not found");
      }

      const namePart = this.name.substring(0, 4).toUpperCase();
      const semesterSufix = semester.name.charAt(semester.name.length - 1); 

      const lastSubject = await mongoose
        .model("ArtSubject")
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

export default mongoose.model("ArtSubject", artSubjectSchema);
