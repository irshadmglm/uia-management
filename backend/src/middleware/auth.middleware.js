import jwt from "jsonwebtoken"
import User from "../models/student.model.js"
import Staff from "../models/staff.model.js";
import Batch from "../models/batch.model.js";
import Semester from "../models/semester.model.js";

export const protectRoute = async (req,res,next) => {
try {
    const token = req.cookies.jwt;
    
    if(!token){
        return res.status(401).json({message:"Unautherised - no token provided"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({message:"Unautherised - invalid token"})
    }

    let user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      user = await Staff.findById(decoded.userId).select("-password");
    }

    if (user.role === "student") {
        const batch = await Batch.findById(user.batchId);
       
        if (batch) {
          user.batchName = batch.name || "Unknown Batch";
    
          const [semester, staff] = await Promise.all([
            batch.currentSemester ? Semester.findById(batch.currentSemester) : null,
            batch.classTeacher ? Staff.findById(batch.classTeacher) : null
          ])
    
          user.semester = semester?.name || "Unknown Semester";
          user.classTeacher = staff?.name || "Unknown Teacher";
          console.log(user.semester, user.classTeacher);
          
        }
    }
    
    req.user = user.toObject();  

    req.user.semester = user.semester;
    req.user.classTeacher = user.classTeacher;
    console.log(req.user);
    
    

    
    
    next();
} catch (error) {
    console.log("error in protectroute middleware", error.message);
    res.status(500).json({message:"internel server error"})
    
}
}