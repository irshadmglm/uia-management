import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Student from "../models/student.model.js";
import Fee from "../models/fees.model.js";
import Marklist from "../models/marklist.model.js";
import Achievement from "../models/achivement.model.js";
import ReadingProgress from "../models/readingProgress.model.js";

// ── CRUD Operations ───────────────────────────────────────────────────────────

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBatch = async (req, res) => {
  try {
    let { batchId } = req.params;
    batchId = new mongoose.Types.ObjectId(batchId);

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ status: false, message: "Batch Not Found" });
    }

    res.status(200).json({ status: true, batch });
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getAssignedBatch = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const assignedbatches = await Batch.find({ classTeacher: teacherId });
    if (!assignedbatches) {
      return res.status(404).json({ status: false, message: "No class assigned" });
    }

    res.status(200).json({ status: true, assignedbatches });
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const postbatches = async (req, res) => {
  try {
    const { name } = req.body;

    const isBatch = await Batch.findOne({ name });
    if (isBatch) {
      return res.status(400).json({ message: "This class already exists" });
    }

    const newBatch = new Batch({ name });
    await newBatch.save();

    res.status(201).json({ message: "Batch created successfully", newBatch });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { name } = req.body;

    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await Student.updateMany({ batchId }, { $set: { batchName: name } });
    res.status(200).json({ message: "Batch updated successfully", updatedBatch });
  } catch (error) {
    console.error("Error updating Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Safety check: refuse hard-delete if related data exists
    const [studentCount, feeCount, markCount, achievementCount, readingCount] =
      await Promise.all([
        Student.countDocuments({ batchId }),
        Fee.countDocuments({ batchId }),
        Marklist.countDocuments({ batchId }),
        Achievement.countDocuments({ batchId }),
        ReadingProgress.countDocuments({ batchId }),
      ]);

    const totalRelated = studentCount + feeCount + markCount + achievementCount + readingCount;

    if (totalRelated > 0) {
      return res.status(400).json({
        message: `Cannot delete batch — it has related data: ${studentCount} student(s), ${feeCount} fee record(s), ${markCount} mark list(s), ${achievementCount} achievement(s), ${readingCount} reading progress record(s). Use 'Archive Batch' (deactivate) instead to safely retire the batch while keeping all its data.`,
        cannotDelete: true,
        relatedCounts: { studentCount, feeCount, markCount, achievementCount, readingCount },
      });
    }

    const deletedBatch = await Batch.findByIdAndDelete(batchId);
    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const deactivatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { isActive: false },
      { new: true }
    );

    if (!deactivatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deactivated successfully", batch: deactivatedBatch });
  } catch (error) {
    console.error("Error deactivating Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const activateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const activatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { isActive: true },
      { new: true }
    );

    if (!activatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch activated successfully", batch: activatedBatch });
  } catch (error) {
    console.error("Error activating Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Teacher, Leader & Semester Assignments ────────────────────────────────────

export const asignBatchTeacher = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;
    const selectedBatch = await Batch.findById(classId);
    if (!selectedBatch) {
      return res.status(404).json({ status: false, message: "Batch not found" });
    }

    selectedBatch.classTeacher = mongoose.Types.ObjectId.isValid(teacherId) ? teacherId : null;
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Teacher assigned successfully", selectedBatch });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignClassLeader = async (req, res) => {
  try {
    const { classId, studentId, second = false } = req.body;
    const selectedBatch = await Batch.findById(classId);
    if (!selectedBatch) {
      return res.status(404).json({ status: false, message: "Batch not found" });
    }
    if (studentId === "No") {
      if (second) {
        selectedBatch.classLeader = null;
      } else {
        selectedBatch.classLeader2 = null;
      }

      await selectedBatch.save();

      return res.status(200).json({
        status: true,
        message: "Class Leader removed successfully",
        selectedBatch,
      });
    }

    if (second) {
      selectedBatch.classLeader2 = mongoose.Types.ObjectId.isValid(studentId) ? studentId : null;
    } else {
      selectedBatch.classLeader = mongoose.Types.ObjectId.isValid(studentId) ? studentId : null;
    }

    await selectedBatch.save();
    res.status(200).json({ status: true, message: "Class Leader assigned successfully", selectedBatch });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignsemester = async (req, res) => {
  try {
    const { classId, semesterId, art } = req.body;

    const selectedBatch = await Batch.findById(classId);
    if (!selectedBatch) {
      return res.status(404).json({ status: false, message: "Batch not found" });
    }
    if (art) {
      selectedBatch.currentArtSemester = mongoose.Types.ObjectId.isValid(semesterId) ? semesterId : null;
    } else {
      selectedBatch.currentSemester = mongoose.Types.ObjectId.isValid(semesterId) ? semesterId : null;
    }

    await selectedBatch.save();
    res.status(200).json({ status: true, message: "Semester assigned successfully", selectedBatch });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

// ── Document & Link Management ────────────────────────────────────────────────

export const CELinkUpdate = async (req, res) => {
  try {
    const { batchId, CEmarkListLink } = req.body;

    if (!batchId || !CEmarkListLink) {
      return res.status(400).json({ message: "Missing batchId or CEmarkList" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.CEmarkList = CEmarkListLink;
    await batch.save();

    return res.status(200).json({ message: "CE Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const CELinkDelete = async (req, res) => {
  try {
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "Missing batchId" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.CEmarkList = null;
    await batch.save();

    return res.status(200).json({ message: "CE Marklist link Deleted successfully", batch });
  } catch (error) {
    console.error("Error in deleting CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const IRLinkUpdate = async (req, res) => {
  try {
    const { batchId, IRmarkListLink } = req.body;

    if (!batchId || !IRmarkListLink) {
      return res.status(400).json({ message: "Missing batchId or CEmarkList" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.IRmarkList = IRmarkListLink;
    await batch.save();

    return res.status(200).json({ message: "IR Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const IRLinkDelete = async (req, res) => {
  try {
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "Missing batchId" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.IRmarkList = null;
    await batch.save();

    return res.status(200).json({ message: "IR Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const academicStatusLinkUpdate = async (req, res) => {
  try {
    const { batchId, ...rest } = req.body;
    const item = Object.keys(rest)[0];

    if (!batchId || !item) {
      return res.status(400).json({ message: `Missing batchId or ${item}` });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch[item] = rest[item];
    await batch.save();

    return res.status(200).json({ message: `${item} link updated successfully `, batch });
  } catch (error) {
    console.error(`Error updating ${item} link:`, error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const academicStatusLinkDelete = async (req, res) => {
  try {
    const { batchId, item } = req.body;

    if (!batchId || !item) {
      return res.status(400).json({ message: `Missing batchId or ${item}` });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch[item] = null;
    await batch.save();

    return res.status(200).json({ message: ` ${item} link Deleted successfully`, batch });
  } catch (error) {
    console.error(`Error updating ${item} link:`, error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
