import Achievement from "../models/achivement.model.js";



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
      const newAchievement = new Achievement({
        ...req.body,
        studentId
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
  