import bcrypt from "bcryptjs";
import Staff from "../models/staff.model.js";
import Student from "../models/student.model.js";
import Batch from "../models/batch.model.js";

export const addUser = async (req, res) => {
  try {
    
    let {studentName, selectedBatch, rollNumber, studentId } = req.body;

    selectedBatch = parseInt(selectedBatch, 10);
    rollNumber = parseInt(rollNumber, 10);

    const existingUser = await Student.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "This student is already registered." });
    }

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
       students = await Student.find({batchId, isActive: true}).sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
    }else{
       students = await Student.find({isActive: true}).sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
    }
    

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, message: "No students found" });
    }

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getStudentsInactive = async (req, res) => {
  try {
    const { batchId } = req.params;
    let students;
    if(batchId){
       students = await Student.find({batchId, isActive: false}).sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
    }else{
       students = await Student.find({isActive: false}).sort({ selectedBatch: 1, rollNumber: 1, division: 1 });
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

  if(updateData.batchName){
    const batchId = await  Batch.findOne({ batchName :updateData.batchName}).batchId;
    updateData.batchId = batchId;
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

export const editTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const updateData = req.body;
    let hashedPassword;

  if(updateData.password){
    const salt = await bcrypt.genSalt(10);
     hashedPassword = await bcrypt.hash(updateData.password, salt);
     updateData.password = hashedPassword;
  }else{
    delete updateData.password;
  }


    const teacher = await Staff.findByIdAndUpdate(teacherId, updateData, {
      new: true,
      runValidators: true, 
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error updating Staff:", error);
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

  try {
    const { studentId } = req.body;
    
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

export const changeStdStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.isActive = !student.isActive;
    await student.save(); 

    res.status(200).json({ success: true, message: "Student status changed", isActive: student.isActive });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const { userId } = req.params;

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
  
  try {
    const teachers = await Staff.find({role: "teacher"}).sort({ name: 1 });
    if (!teachers || teachers.length === 0) {
      return res.status(200).json({ success: false, message: "No Teachers found", teachers:[]});
    }
    
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
    console.log(error);
    
  }
}

export const getTeacher = async (req, res) => {
  try {
    const {teacherId} = req.params;

    const teacher = await Staff.findById(teacherId);

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const deletedUser = await Staff.findByIdAndDelete(teacherId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
