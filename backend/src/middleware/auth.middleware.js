import jwt from "jsonwebtoken"
import User from "../models/student.model.js"
import Staff from "../models/staff.model.js";

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
    

    req.user = user;
    
    next();
} catch (error) {
    console.log("error in protectroute middleware", error.message);
    res.status(500).json({message:"internel server error"})
    
}
}