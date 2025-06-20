import ReadingProgress from "../models/readingProgress.model.js";

export const getStdReadingProgress = async (req, res) => {
    try {
      const { studentId } = req.params;
      const records = await ReadingProgress.find({ studentId });
      res.json(records);
    } catch (error) {
      console.error("Error fetching reading progress:", error.message);
      res.status(500).json({ message: "Failed to get reading progress" });
    }
  };
  
  export const postStdReadingProgress = async (req, res) => {
    try {
      const { studentId } = req.params;
      const newRecord = new ReadingProgress({
        ...req.body,
        studentId
      });
      const saved = await newRecord.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving reading progress:", error.message);
      res.status(400).json({ message: "Failed to add reading progress" });
    }
  };
  
  export const editStdReadingProgress = async (req, res) => {
    try {
      const { recordId } = req.params;
      const updated = await ReadingProgress.findByIdAndUpdate(
        recordId,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (error) {
      console.error("Error updating reading progress:", error.message);
      res.status(400).json({ message: "Failed to update reading progress" });
    }
  };
  