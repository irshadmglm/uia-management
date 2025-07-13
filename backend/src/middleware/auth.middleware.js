import jwt from "jsonwebtoken"
import User from "../models/student.model.js"
import Staff from "../models/staff.model.js";
import Batch from "../models/batch.model.js";
import Student from "../models/student.model.js";
import Semester from "../models/semester.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    let user = await User.findOne({ _id: decoded.userId, isActive: true }).select("-password");

    if (!user) {
      user = await Staff.findById(decoded.userId).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (user.role === "student") {
      const batch = await Batch.findById(user.batchId);
      if (batch) {
        const [semester, staff, leader1, leader2] = await Promise.all([
          batch.currentSemester ? Semester.findById(batch.currentSemester) : null,
          batch.classTeacher ? Staff.findById(batch.classTeacher) : null,
          batch.classLeader ? Student.findById(batch.classLeader) : null,
          batch.classLeader2 ? Student.findById(batch.classLeader2) : null,
        ]);

        user = user.toObject(); 
        user.batchName = batch.name || "Unknown Batch";
        user.semester = semester?.name || " ";
        user.classTeacher = staff?.name || " ";
        user.classLeader = leader1?.name || " ",
        user.classLeader2 = leader2?.name || " "
      }
    } else {
      user = user.toObject(); 
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};