import mongoose from "mongoose";
import Subject from "../models/Subject.model.js";
import Semester from "../models/semester.model.js";
import ArtSubject from "../models/artsubject.model.js";
import ArtSemester from "../models/artsemester.model.js";
import Staff from "../models/staff.model.js";
import Batch from "../models/batch.model.js";

// ── CRUD Operations ───────────────────────────────────────────────────────────

export const getSubjects = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const subjects = await Subject.find({ semester: semesterId });

    if (subjects.length === 0) {
      return res.status(200).json(subjects);
    }

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArtSubjects = async (req, res) => {
  try {
    const { semesterId } = req.params;

    // Primary: fetch from unified Subject collection
    let subjects = await Subject.find({
      $or: [
        { semester: semesterId, type: "art" },
        { artSemester: semesterId },
        { semester: semesterId, isArtSub: true },
      ],
    });

    if (!subjects || subjects.length === 0) {
      subjects = await ArtSubject.find({ artSemester: semesterId });
    }

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postSubject = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name, mark, CEmark, isArtSub } = req.body;

    if (!name || !mark) {
      return res.status(400).json({ message: "Subject name and mark are required" });
    }

    if (isArtSub) {
      const isArtSubject = await Subject.findOne({
        name,
        type: "art",
        $or: [{ semester: semesterId }, { artSemester: semesterId }],
      });
      if (isArtSubject) {
        return res.status(400).json({ message: "This subject already exists" });
      }

      const newSubject = new Subject({
        name,
        mark,
        CEmark,
        type: "art",
        isArtSub: true,
        semester: semesterId,
        artSemester: semesterId,
      });

      await newSubject.save();

      try {
        await ArtSubject.findByIdAndUpdate(
          newSubject._id,
          { name, mark, CEmark, artSemester: semesterId, code: newSubject.code },
          { upsert: true }
        );
      } catch (_) {}

      const selectedSemester = await Semester.findById(semesterId);
      if (selectedSemester) {
        selectedSemester.subjects = selectedSemester.subjects || [];
        selectedSemester.subjects.push(newSubject._id);
        await selectedSemester.save();
      }
      try {
        await ArtSemester.findByIdAndUpdate(semesterId, {
          $addToSet: { subjects: newSubject._id },
        });
      } catch (_) {}

      return res.status(201).json({ message: "Art subject created successfully", newSubject });
    }

    const isRegularSubject = await Subject.findOne({ name, semester: semesterId });
    if (isRegularSubject) {
      return res.status(400).json({ message: "This subject already exists" });
    }

    const newSubject = new Subject({ name, mark, CEmark, semester: semesterId });
    await newSubject.save();

    const selectedSemester = await Semester.findById(semesterId);
    if (!selectedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    selectedSemester.subjects = selectedSemester.subjects || [];
    selectedSemester.subjects.push(newSubject._id);
    await selectedSemester.save();

    return res.status(201).json({ message: "Subject created successfully", newSubject });
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Semester.findOneAndUpdate(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { new: true }
    );

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, mark, CEmark } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (mark !== undefined) updates.mark = mark;
    if (CEmark !== undefined) updates.CEmark = CEmark;

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error("Error updating Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArtSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    await ArtSubject.findByIdAndDelete(subjectId).catch(() => {});

    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Semester.findOneAndUpdate(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    );
    await ArtSemester.findOneAndUpdate(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    ).catch(() => {});

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArtSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, mark, CEmark } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (mark !== undefined) updates.mark = mark;
    if (CEmark !== undefined) updates.CEmark = CEmark;

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updates, {
      new: true,
      runValidators: true,
    });
    await ArtSubject.findByIdAndUpdate(subjectId, updates).catch(() => {});

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error("Error updating Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Teacher & Period Assignment for Subjects ──────────────────────────────────

export const asignSubteacher = async (req, res) => {
  try {
    const { subjectId, teacherId, second = false, art = false } = req.body;
    let subject;
    if (art) {
      subject = await ArtSubject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ status: false, message: "Subject not found" });
      }
    } else {
      subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ status: false, message: "Subject not found" });
      }
    }

    if (teacherId === "No") {
      if (second) {
        subject.subTeacher2 = null;
      } else {
        subject.subTeacher = null;
      }

      await subject.save();

      return res.status(200).json({
        status: true,
        message: "Subject teacher removed successfully",
        subject,
      });
    }

    const teacher = await Staff.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ status: false, message: "Teacher not found" });
    }

    if (second) {
      subject.subTeacher2 = teacherId;
    } else {
      subject.subTeacher = teacherId;
    }

    await subject.save();

    res.status(200).json({
      status: true,
      message: "Subject teacher assigned successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const asignSubteacherPeriod = async (req, res) => {
  try {
    const { subjectId, period, second = false, art = false } = req.body;

    let subject;
    if (art) {
      subject = await ArtSubject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ status: false, message: "Subject not found" });
      }
    } else {
      subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ status: false, message: "Subject not found" });
      }
    }

    if (period === 0) {
      if (second) {
        subject.periodTeacher2 = null;
      } else {
        subject.periodTeacher1 = null;
      }

      await subject.save();

      return res.status(200).json({
        status: true,
        message: "Subject Period removed successfully",
        subject,
      });
    }

    if (second) {
      subject.periodTeacher2 = period;
    } else {
      subject.periodTeacher1 = period;
    }

    await subject.save();

    res.status(200).json({
      status: true,
      message: "Subject Period assigned successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ── Subject Aggregations & Current Semester Subjects ──────────────────────────

export const assignedSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const subjects = await Subject.aggregate([
      {
        $match: {
          $or: [
            { subTeacher: new mongoose.Types.ObjectId(teacherId) },
            { subTeacher2: new mongoose.Types.ObjectId(teacherId) },
          ],
        },
      },
      {
        $lookup: {
          from: "batches",
          let: { semesterId: "$semester" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$currentSemester", "$$semesterId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                CEmarkList: 1,
                currentSemester: 1,
              },
            },
          ],
          as: "batchDetails",
        },
      },
      {
        $unwind: {
          path: "$batchDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const artSubjects = await ArtSubject.aggregate([
      {
        $match: {
          $or: [
            { subTeacher: new mongoose.Types.ObjectId(teacherId) },
            { subTeacher2: new mongoose.Types.ObjectId(teacherId) },
          ],
        },
      },
      {
        $lookup: {
          from: "batches",
          let: { semesterId: "$artSemester" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$currentArtSemester", "$$semesterId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                CEmarkList: 1,
                currentArtSemester: 1,
              },
            },
          ],
          as: "batchDetails",
        },
      },
      {
        $unwind: {
          path: "$batchDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const combined = [...subjects, ...artSubjects];
    return res.status(200).json(combined);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const curruntSemSubjects = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (!batch.currentSemester) {
      return res.status(400).json({ message: "Semester not assigned" });
    }

    const subjects = await Subject.aggregate([
      {
        $match: { semester: batch.currentSemester },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "subTeacher",
          foreignField: "_id",
          as: "subTeacherInfo",
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "subTeacher2",
          foreignField: "_id",
          as: "subTeacher2Info",
        },
      },
      {
        $project: {
          name: 1,
          mark: 1,
          CEmark: 1,
          "subTeacherInfo.name": 1,
          "subTeacher2Info.name": 1,
        },
      },
    ]);

    const artSubjects = await ArtSubject.aggregate([
      {
        $match: { artSemester: batch.currentArtSemester },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "subTeacher",
          foreignField: "_id",
          as: "subTeacherInfo",
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "subTeacher2",
          foreignField: "_id",
          as: "subTeacher2Info",
        },
      },
      {
        $project: {
          name: 1,
          mark: 1,
          CEmark: 1,
          "subTeacherInfo.name": 1,
          "subTeacher2Info.name": 1,
        },
      },
    ]);

    const combined = [...subjects, ...artSubjects];
    return res.status(200).json(combined);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
