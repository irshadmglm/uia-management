import asyncHandler from "express-async-handler";
import RegisteredUser from "../models/registeredUser.model.js";
import Student from "../models/student.model.js";
import bcrypt from "bcryptjs";
import Batch from "../models/batch.model.js";


export const newAdmission = asyncHandler(async (req, res) => {
  const { studentName, phoneNumber, password, selectedBatch, gender, dateOfBirth, profileImage } = req.body;

  if ( !studentName || !phoneNumber || !password || !selectedBatch || !gender || !dateOfBirth ) {
    return res.status(400).json({ message: "All fields are required" });
  };

  if (password.length < 4 ) {
    return res.status(400).json({ message: "Password must be at least 4 characters" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const classId = await Batch.findOne({ name: selectedBatch }).select("_id");

  const newAdmission = new RegisteredUser({
    studentName,
    phoneNumber,
    password: hashedPassword,
    selectedBatch,
    classId,
    gender,
    dateOfBirth,
    profileImage,
  });

  if(newAdmission){
     await newAdmission.save();

    res.status(201).json({
      success: true,
      message: "Form submitted successfully. We will contact you soon.",
      student: newAdmission,
    });
  }
   

  
});


export const getRegisteredStudents = asyncHandler(async (req, res) => {

    const registeredStudents = await RegisteredUser.find(); 

    res.status(200).json({ success: true, students: registeredStudents });
});

export const selected = asyncHandler(async (req, res) => {

    const { id, isSelected } = req.body;

  
    const registeredStudent = await RegisteredUser.findByIdAndUpdate(id, { isSelected: isSelected }, { new: true });
    
    if(!isSelected){
      return res.status(201).json({ success: true, message: "Student not selected" });
    }
    if (!registeredStudent) {
  
      return res.status(404).json({ success: false, message: "Student not found" });
    }
  
    const { studentName, phoneNumber, password, selectedBatch, classId, gender, dateOfBirth, profileImage } = registeredStudent;
  
    // Count students in the same class & gender
    let count = await Student.countDocuments({
      selectedBatch,
      gender
    });
  
    const rollNumber = count + 1;
    const classMap = {};
    const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    
    const batches = await Batch.find().select("name").sort(); 
    
    batches.forEach((c, i) => {
      classMap[c.name] = alph[i] || ""; 
    });

    const classPrefix = classMap[selectedBatch] || "X"; 
    const genderPrefix = gender === "Male" ? "B" : "G";
    const studentId = `${classPrefix}${genderPrefix}${rollNumber}`;

  
    const newStudent = new Student({
      studentName,
      phoneNumber,
      password,
      selectedBatch,
      classId,
      gender,
      dateOfBirth,
      profileImage,
      rollNumber,
      studentId
    });
  
    const saveStudent = await newStudent.save();

    const cls = await Batch.findById(classId); 
    if (!cls) {
        throw new Error("Batch not found");
    }

    cls.students.push(saveStudent._id);
    await cls.save();  
  
    res.status(201).json({
      success: true,
      message: "New Student Admitted",
      student: saveStudent,
    });
});

