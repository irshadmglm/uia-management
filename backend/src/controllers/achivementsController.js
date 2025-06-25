import Achievement from "../models/achivement.model.js";
import Student from "../models/student.model.js";
import { getCountToApprove } from "./marksComtroller.js";



export const getStdAchivement = async (req, res) => {
    try {
      const { studentId } = req.params;
      const achievements = await Achievement.find({ studentId });
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error.message);
      res.status(500).json({ message: "Failed to get achievements" });
    }
  };
  export const postStdAchivement = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findById(studentId);
      const newAchievement = new Achievement({
        ...req.body,
        studentId,
        batchId: student.batchId
      });
      const saved = await newAchievement.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving achievement:", error.message);
      res.status(400).json({ message: "Failed to add achievement" });
    }
  };
  
  export const editStdAchivement = async (req, res) => {
    try {
      const { achivemnetId } = req.params;
      const updated = await Achievement.findByIdAndUpdate(
        achivemnetId,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (error) {
      console.error("Error updating achievement:", error.message);
      res.status(400).json({ message: "Failed to update achievement" });
    }
  };
  export const deleteStdAchivement = async (req, res) => {
    try {
      const { achivemnetId } = req.params;
      const deleted = await Achievement.findByIdAndDelete(achivemnetId);
  
      if (!deleted) {
        return res.status(404).json({ message: "Achievement not found" });
      }
  
      res.json({ message: "Achievement deleted successfully", deleted });
    } catch (error) {
      console.error("Error deleting achievement:", error.message);
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  };

  export const getToApprove = async (req, res) => {
    try {
      const { batchId } = req.params;
  
      if (!batchId ) {
        return res.status(400).json({ message: "batchId is required" });
      }
  
      const achievement = await Achievement.find({batchId: batchId, approval: false});
  
      res.status(200).json(achievement);
    } catch (error) {
      console.error("Error fetching approval count:", error.message);
      res.status(500).json({ message: "Failed to get approval count" });
    }
  };
  
  
  