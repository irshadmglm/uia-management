import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Staff from "../models/staff.model.js";
import Subject from "../models/Subject.model.js";
import Timetable from "../models/timetable.model.js";
import Semester from "../models/semester.model.js";

export const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne();
    if (!timetable) {
      // Initialize timetable with a grid for each weekday.
      timetable = new Timetable({
        grid: {
          Monday: Array.from({ length: 3 }, () => Array(5).fill(null)),
          Tuesday: Array.from({ length: 3 }, () => Array(5).fill(null)),
          Wednesday: Array.from({ length: 3 }, () => Array(5).fill(null)),
          Thursday: Array.from({ length: 3 }, () => Array(5).fill(null)),
          Friday: Array.from({ length: 3 }, () => Array(5).fill(null)),
          Saturday: Array.from({ length: 3 }, () => Array(5).fill(null)),
        },
      });
      await timetable.save();
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const postTimetable = async (req, res) => {
  try {
    const { grid } = req.body;
    console.log("Updated grid:", grid);

    let timetable = await Timetable.findOne();

    if (timetable) {
      timetable.grid = grid;
      await timetable.save();
    } else {
      timetable = new Timetable({ grid });
      await timetable.save();
    }
    res.json({ message: "Timetable updated", timetable });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find(); 
    console.log(semesters);
    
    res.status(200).json(semesters); 

  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const postSemester = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.body);
    
    const isSemester = await Semester.findOne({ name });
    if (isSemester) {
      return res.status(400).json({ message: "This Semester already exists" });
    }

    const newSemester = new Semester({ name });
    await newSemester.save(); 

    res.status(201).json({ message: "Semester created successfully", newSemester });
  } catch (error) {
    console.error("Error creating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({createdAt: 1}); 
    
    res.status(200).json(batches); 

  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({ status: false, message: "Batch Not Found" });
    }

    res.status(200).json({ status: true, batch });
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getAssignedBatch = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const assignedbatches = await Batch.find({ classTeacher: teacherId });
    console.log(assignedbatches);
    
    if (!assignedbatches) {
      return res.status(404).json({ status: false, message: "No class assigned" });
    }

    res.status(200).json({ status: true, assignedbatches });
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const postbatches = async (req, res) => {
  try {
    const { name } = req.body;

    const isBatch = await Batch.findOne({ name });
    if (isBatch) {
      return res.status(400).json({ message: "This class already exists" });
    }

    const newBatch = new Batch({ name });
    await newBatch.save(); 

    res.status(201).json({ message: "Batch created successfully", newBatch });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const CELinkUpdate = async (req, res) => {
  console.log(req.body);
  
  try {
    const { batchId, CEmarkListLink } = req.body;

    if (!batchId || !CEmarkListLink) {
      return res.status(400).json({ message: "Missing batchId or CEmarkList" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.CEmarkList = CEmarkListLink;
    await batch.save();

    return res.status(200).json({ message: "CE Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const IRLinkUpdate = async (req, res) => {
  
  try {
    const { batchId, IRmarkListLink } = req.body;

    if (!batchId || !IRmarkListLink) {
      return res.status(400).json({ message: "Missing batchId or CEmarkList" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.IRmarkList = IRmarkListLink;
    await batch.save();

    return res.status(200).json({ message: "IR Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


export const getSubjects = async (req,res) => {
  try {
    let {semesterId} = req.params;

    const subjects = await Subject.find({semester: semesterId}); 

    if (subjects.length === 0) {
      return res.status(200).json({ message: "No subjects found for this semester", subjects: [] });
    }

    res.status(200).json(subjects); 

  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const postSubject = async (req, res) => {
  try {
    let {semesterId} = req.params;
 console.log(semesterId);
 
    const { name, mark, CEmark } = req.body;

    if (!name || !mark) {
      return res.status(400).json({ message: "Subject name and mark are required" });
    }

    const isSubject = await Subject.findOne({ name, semester: semesterId });

    if (isSubject) {
      return res.status(400).json({ message: "This subject already exists" });
    }

    const newSubject = new Subject({ name, mark, CEmark, semester: semesterId });
    await newSubject.save();

    const SelectedSemester = await Semester.findById(semesterId);
    if (!SelectedSemester) {
        throw new Error("Semester not found");
    }
    SelectedSemester.subjects.push(newSubject._id);  
    await SelectedSemester.save();  
  
    res.status(201).json({ message: "Subject created successfully", newSubject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const asignBatchTeacher = async (req, res) => {
   try {
    const {classId, teacherId} = req.body;
    const selectedBatch = await Batch.findById(classId);
    if(!selectedBatch){
     return res.status(404).json({status: false, message:"Batch not found"});
    }
    
    selectedBatch.classTeacher = mongoose.Types.ObjectId.isValid(teacherId) ? teacherId : null;
     
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Teacher assigned successfully", selectedBatch });
  } catch (error) {
     res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignClassLeader = async (req, res) => {
   try {
    const {classId, studentId} = req.body;
    const selectedBatch = await Batch.findById(classId);
    if(!selectedBatch){
     return res.status(404).json({status: false, message:"Batch not found"});
    }
    
    selectedBatch.classLeader = mongoose.Types.ObjectId.isValid(studentId) ? studentId : null;
     
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Class Leader assigned successfully", selectedBatch });
  } catch (error) {
     res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignsemester = async (req, res) => {
   try {
    const {classId, semesterId} = req.body;
    const selectedBatch = await Batch.findById(classId);
    if(!selectedBatch){
     return res.status(404).json({status: false, message:"Batch not found"});
    }
    
    selectedBatch.currentSemester = mongoose.Types.ObjectId.isValid(semesterId) ? semesterId : null;
     
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Semester assigned successfully", selectedBatch });
  } catch (error) {
     res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignSubteacher = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;
    
    const teacher = await Staff.findById(teacherId);
    if (!teacher) {
       return res.status(404).json({ status: false, message: "Teacher not found" });
    }
    
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found" });
   }
   subject.subTeacher = teacherId;
    await subject.save();

    res.status(200).json({ status: true, message: "Subject assigned successfully", subject });
 } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
 }
}


export const assignedSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const subjects = await Subject.aggregate([
      {
        $match: { subTeacher: new mongoose.Types.ObjectId(teacherId) }
      },
      {
        $lookup: {
          from: "batches",
          let: { semesterId: "$semester" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$currentSemester",
                    "$$semesterId"
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                CEmarkList:1,
                currentSemester: 1
              }
            }
          ],
          as: "batchDetails"
        }
      },
      {
        $unwind: {
          path: "$batchDetails",
          preserveNullAndEmptyArrays: true // If you want to see subjects even without batch match
        }
      }
    ]);

    return res.status(200).json(subjects);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const curruntSemSubjects = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      
      return res.status(404).json({ message: "Batch not found" });
    }

    if (!batch.currentSemester) {

      return res.status(400).json({ message: "Semester not assigned" });
    }


    const subjects = await Subject.aggregate([
      {
        $match: { semester: batch.currentSemester }
      },
      {
        $lookup: {
          from: "staffs", 
          localField: "subTeacher",   
          foreignField: "_id",    
          as: "subTeacherInfo"    
        }
      },
      {
        $project:{
          name: 1,
          mark: 1,
          "subTeacherInfo.name": 1
        }
      }
    ])

    return res.status(200).json(subjects);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};





export const postAttendance = async (req, res) => {
try {
  let {attendance, classId, date} = req.body;
console.log(req.body);

  if (!classId) {
    return res.status(400).json({ error: "classId is required" });
  }
    
  date = date ? new Date(date) : new Date();
  if (isNaN(date.getTime())) {
    console.log("Invalid date format");
    return res.status(400).json({ error: "Invalid date format" });
  }

  const monthName = date.toLocaleString("default", { month: "long" }); 
  const day = date.getDate();
console.log(day, monthName);

let response = await Batch.updateOne(
  { _id: classId },
  { $set: { [`attendance.${monthName}.${day}`]: attendance } }
);

console.log(response);

 res.status(200).json({ message: "Attendance marked successfully!" });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
}

export const getAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ error: "classId and date are required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const monthName = parsedDate.toLocaleString("default", { month: "long" });
    const day = parsedDate.getDate(); 

    const classData = await Batch.findOne(
      { _id: classId },
      { [`attendance.${monthName}.${day}`]: 1, _id: 0 }
    );

    if (!classData) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const attendance = classData.attendance?.[monthName]?.[day] || {};

    res.status(200).json({ date, attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



