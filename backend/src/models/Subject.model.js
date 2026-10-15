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
      uppercase: true,
    },
    // 'academic' = regular subject, 'art' = art-track subject
    // Allows merging Subject + ArtSubject into one collection
    type: {
      type: String,
      enum: ['academic', 'art'],
      default: 'academic',
    },
    isArtSub: {
      type: Boolean,
      default: false,
    },
    // Unified semester ref — points to Semester collection for both academic & art
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    // Kept for backward compat during migration — will be removed after data migrated
    artSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",  // now refs Semester (after migration) instead of ArtSemester
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
      // Use whichever semester field is set (academic or art)
      const semesterId = this.semester || this.artSemester;
      if (!semesterId) return next();

      // Both now live in the Semester collection
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
