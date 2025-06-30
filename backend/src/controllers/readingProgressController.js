import ReadingProgress from "../models/readingProgress.model.js";
import Student from "../models/student.model.js";

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
      const student = await Student.findById(studentId);
      const newRecord = new ReadingProgress({
        ...req.body,
        studentId,
        batchId: student.batchId
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

  export const deleteStdReadingProgress = async (req, res) => {
      try {
        const { recordId } = req.params;
        const deleted = await ReadingProgress.findByIdAndDelete(recordId);
    
        if (!deleted) {
          return res.status(404).json({ message: "ReadingProgress not found" });
        }
    
        res.json({ message: "ReadingProgress deleted successfully", deleted });
      } catch (error) {
        console.error("Error deleting ReadingProgress:", error.message);
        res.status(500).json({ message: "Failed to delete ReadingProgress" });
      }
    };
  
   
     export const getCountToApproveByStd = async (req, res) => {
       try {
         const { batchId } = req.params;
     
         if (!batchId ) {
           return res.status(400).json({ message: "batchId is required" });
         }
         const counts = await ReadingProgress.aggregate([
           { $match: { approval: false, batchId: batchId } },
           { $group: { _id: "$studentId", count: { $sum: 1 } } } 
       ]);
       
       res.status(200).json(counts);
       } catch (error) {
         console.error("Error fetching count to approve:", error);
         res.status(500).json({ message: "Internal Server Error" });
       }
     };
   
     export const getCountToApproveByBatch = async (req, res) => {
         try {
             const counts = await ReadingProgress.aggregate([
                 { $match: { approval: false } },
                 { $group: { _id: "$batchId", count: { $sum: 1 } } } 
             ]);
             
             res.status(200).json(counts);
         } catch (error) {
             console.error("Error fetching count to approve:", error);
             res.status(500).json({ message: "Internal Server Error" });
         }
     };
     