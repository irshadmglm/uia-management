import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/student.model.js";
import cloudinary from "../lib/cloudinary.js";
import Staff from "../models/staff.model.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import Student from "../models/student.model.js";
import Batch from "../models/batch.model.js";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = '1rNnVoeYyt9OyeJe39o0Tyiucn-NUkEf1RkqZ6ZyHwxU';


export const signup = async (req, res) => {
  const { name, userName, phoneNumber, password, role } = req.body;
  
  try {
    if (!name || !userName || !phoneNumber || !password || !role ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 4 ) { 
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    const staff = await Staff.findOne({ phoneNumber });

    if (staff) return res.status(400).json({ message: "Phone Number already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = new Staff({
      name,
      userName,
      phoneNumber,
      role,
      password: hashedPassword,
    });

    if (newStaff) {
      // generateToken(newStaff._id, res);
      await newStaff.save();

      res.status(201).json({
        _id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        // profilePic: newStaff.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password, role} = req.body;
  
  try {
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    let user;

    if (role === "student") {
      user = await User.findOne({ cicNumber:Number(username), isActive: true });
    } else {
      user = await Staff.findOne({ userName:username });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);

    const responseData = {
      _id: user._id,
      name: user.name,
      batch: user.batch || null,
      batchId: user.batchId || null,
      email: user.email || null,
      address: user.address || null,
      cicNumber: user.cicNumber || null,
      phoneNumber: user.phoneNumber || null,
      whatsupNumber: user.whatsupNumber || null,
      parentNumber: user.parentNumber || null,
      role: user.role || null,
      profileImage: user.profileImage || null,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const fetchGoogleSheetData = async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 

    console.log(`Sheet Title: ${doc.title}`);

    const sheet = doc.sheetsByIndex[0]; 
    console.log(`Worksheet Title: ${sheet.title}`);
    console.log(`Total Rows: ${sheet.rowCount}`);

    const rows = await sheet.getRows();
   
    const formattedData = rows.map(row => row._rawData);
    for(let c of formattedData){
console.log(c);

      // const batch = await Batch.findOne({ name: c[1] });
      
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(c[2], salt);
       
  
    }


    res.status(200).json({ data: formattedData });

  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const checkAuth = (req, res) => {
  try {
    
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};