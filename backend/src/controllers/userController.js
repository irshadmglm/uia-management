import bcrypt from "bcryptjs";
import Staff from "../models/staff.model.js";
import Student from "../models/student.model.js";

export const addUser = async (req, res) => {
  try {
    console.log(req.body);
    
    let {studentName, selectedBatch, rollNumber, studentId } = req.body;

    selectedBatch = parseInt(selectedBatch, 10);
    rollNumber = parseInt(rollNumber, 10);

    // Check if student already exists
    const existingUser = await Student.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "This student is already registered." });
    }

    // Create new user
    const newUser = new Student({
      studentName,
      selectedBatch,
      rollNumber,
      studentId
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Student registered successfully", 
      user: savedUser 
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { batchId } = req.params;
    let students;
    if(batchId){
       students = await Student.find({batchId}).sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
    }else{
       students = await Student.find().sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
    }
    

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, message: "No students found" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const {studentId} = req.params;

    const student = await Student.findById(studentId);

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const editStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;
    let hashedPassword;

  if(updateData.password){
    const salt = await bcrypt.genSalt(10);
     hashedPassword = await bcrypt.hash(updateData.password, salt);
     updateData.password = hashedPassword;
  }else{
    delete updateData.password;
  }

    const student = await Student.findByIdAndUpdate(studentId, updateData, {
      new: true,
      runValidators: true, 
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getUser = async (req,res) => {
  try {
    const { userId } = req.params;
    const user = await Student.findOne({ studentId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    
  }
}

export const updateUser = async (req, res) => {
  console.log("Request Body:", req.body);

  try {
    const { studentId } = req.body;
    console.log("Updating Student with studentId:", studentId);
    
    const updateData = req.body;

    const updatedUser = await Student.findOneAndUpdate(
      { studentId }, 
      updateData, 
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, message: "Student updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from URL params

    const deletedUser = await Student.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTeachers = async (req, res) => {
  console.log("it is caled");
  
  try {
    const teachers = await Staff.find({role: "teacher"}).sort({ name: 1 });
    if (!teachers || teachers.length === 0) {
      return res.status(200).json({ success: false, message: "No Teachers found", teachers:[]});
    }
    console.log(teachers);
    
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
    console.log(error);
    
  }
}
