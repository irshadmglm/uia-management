import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Staff from "../models/staff.model.js";
import Subject from "../models/Subject.model.js";
import Timetable from "../models/timetable.model.js";
import Semester from "../models/semester.model.js";
import ArtSemester from "../models/artsemester.model.js";
import ArtSubject from "../models/artsubject.model.js";

export const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne();
    let batch = await Batch.find()
    
    if (!timetable) {
      const weekdays = [ "Saturday","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
      const periodCount = 3;
      
      const createEmptySlot = () =>
        Object.fromEntries(batch.map((b) => [b.name, null]));
      
      const grid = {};
      
      weekdays.forEach((day) => {
        grid[day] = Array.from({ length: periodCount }, createEmptySlot);
      });
      
     timetable = new Timetable({ grid });
      
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const postTimetable = async (req, res) => {
  try {
    const { grid } = req.body;

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
    
    res.status(200).json(semesters); 

  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postSemester = async (req, res) => {
  try {
    const { name } = req.body;
    
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
};

export const deleteSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const deletedSemester = await Semester.findByIdAndDelete(semesterId);
    if (!deletedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name } = req.body;

    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      { name },
      { new: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester updated successfully", updatedSemester });
  } catch (error) {
    console.error("Error updating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArtSems = async (req, res) => {
  try {
    const artSems = await ArtSemester.find(); 
    
    res.status(200).json(artSems); 

  } catch (error) {
    console.error("Error fetching art semesters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postArtSem = async (req, res) => {
  try {
    const { name } = req.body;
    
    const isartSemester = await ArtSemester.findOne({ name });
    if (isartSemester) {
      return res.status(400).json({ message: "This Semester already exists" });
    }

    const newArtSem = new ArtSemester({ name });
    await newArtSem.save(); 

    res.status(201).json({ message: "Semester created successfully", newArtSem });
  } catch (error) {
    console.error("Error creating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArtSem = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const deletedSemester = await ArtSemester.findByIdAndDelete(semesterId);
    if (!deletedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester deleted successfully" });
  } catch (error) {
    console.error("Error deleting Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArtSem = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name } = req.body;

    const updatedSemester = await ArtSemester.findByIdAndUpdate(
      semesterId,
      { name },
      { new: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json({ message: "Semester updated successfully", updatedSemester });
  } catch (error) {
    console.error("Error updating Semester:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    
    res.status(200).json(batches); 

  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const deletedBatch = await Batch.findByIdAndDelete(batchId);
    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { name } = req.body;
    
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { name },
      { new: true, runValidators: true }
    );
    

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch updated successfully", updatedBatch });
  } catch (error) {
    console.error("Error updating Batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBatch = async (req, res) => {
  try {
    let { batchId } = req.params;

    batchId = new mongoose.Types.ObjectId(batchId)

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

export const CELinkDelete = async (req, res) => {
  
  try {
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "Missing batchId" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.CEmarkList = null;
    await batch.save();

    return res.status(200).json({ message: "CE Marklist link Deleted successfully", batch });
  } catch (error) {
    console.error("Error in deleting CE Marklist link:", error);
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

export const IRLinkDelete = async (req, res) => {
  
  try {
    const { batchId } = req.body;

    if (!batchId ) {
      return res.status(400).json({ message: "Missing batchId" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.IRmarkList = null;
    await batch.save();

    return res.status(200).json({ message: "IR Marklist link updated successfully", batch });
  } catch (error) {
    console.error("Error updating CE Marklist link:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const academicStatusLinkUpdate = async (req, res) => {
  
  try {
    const { batchId, ...rest } = req.body;

    const item = Object.keys(rest)[0]
    

    if (!batchId || !item) {
      console.log(`Missing batchId or ${item}`);
      
      return res.status(400).json({ message: `Missing batchId or ${item}` });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch[item] = rest[item];
    await batch.save();

    return res.status(200).json({ message: `${item} link updated successfully `, batch });
  } catch (error) {
    console.error( `Error updating ${item} link:`, error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const academicStatusLinkDelete = async (req, res) => {
  
  try {
    const { batchId, item } = req.body;
    
    if (!batchId || !item) {
      
      return res.status(400).json({ message: `Missing batchId or ${item}` });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch[item] = null;
    await batch.save();

    return res.status(200).json({ message: ` ${item} link Deleted successfully`, batch });
  } catch (error) {
    console.error( `Error updating ${item} link:`, error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getSubjects = async (req,res) => {
  try {
    let {semesterId} = req.params;

    const subjects = await Subject.find({semester: semesterId}); 

    if (subjects.length === 0) {
      return res.status(200).json( subjects);
    }

    res.status(200).json(subjects); 

  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArtSubjects = async (req,res) => {
  try {
    let {semesterId} = req.params;

    const subjects = await ArtSubject.find({artSemester: semesterId}); 

    if (subjects.length === 0) {
      return res.status(200).json( subjects);
    }

    res.status(200).json(subjects); 

  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postSubject = async (req, res) => {
  try {
    const { semesterId } = req.params;
    
    const { name, mark, CEmark, isArtSub } = req.body;

    if (!name || !mark) {
      return res.status(400).json({ message: "Subject name and mark are required" });
    }
    
    if (isArtSub) {
      
      const isArtSubject = await ArtSubject.findOne({ name, artSemester: semesterId });
      if (isArtSubject) {
        return res.status(400).json({ message: "This subject already exists" });
      }
      const newSubject = new ArtSubject({ name, mark, CEmark, artSemester: semesterId });

      await newSubject.save();

      const selectedArtSemester = await ArtSemester.findById(semesterId);
      if (!selectedArtSemester) {
        return res.status(404).json({ message: "Art Semester not found" });
      }

      selectedArtSemester.subjects = selectedArtSemester.subjects || [];
      selectedArtSemester.subjects.push(newSubject._id);
      await selectedArtSemester.save();

      return res.status(201).json({ message: "Art subject created successfully", newSubject });
    }

    const isRegularSubject = await Subject.findOne({ name, semester: semesterId });
    if (isRegularSubject) {
      return res.status(400).json({ message: "This subject already exists" });
    }

    const newSubject = new Subject({ name, mark, CEmark, semester: semesterId });
    await newSubject.save();

    const selectedSemester = await Semester.findById(semesterId);
    if (!selectedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    selectedSemester.subjects = selectedSemester.subjects || [];
    selectedSemester.subjects.push(newSubject._id);
    await selectedSemester.save();

    return res.status(201).json({ message: "Subject created successfully", newSubject });
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Semester.findOneAndUpdate(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { new: true }
    );
    

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, mark, CEmark } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (mark !== undefined) updates.mark = mark;
    if (CEmark !== undefined) updates.CEmark = CEmark;

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updates, {
      new: true,
      runValidators: true
    });

    

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error("Error updating Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArtSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const deletedSubject = await ArtSubject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await ArtSemester.findOneAndUpdate(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { new: true }
    );
    

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting Subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArtSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, mark, CEmark } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (mark !== undefined) updates.mark = mark;
    if (CEmark !== undefined) updates.CEmark = CEmark;

    const updatedSubject = await ArtSubject.findByIdAndUpdate(subjectId, updates, {
      new: true,
      runValidators: true
    });

    

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error("Error updating Subject:", error);
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
    const {classId, studentId, second = false} = req.body;
    const selectedBatch = await Batch.findById(classId);
    if(!selectedBatch){
     return res.status(404).json({status: false, message:"Batch not found"});
    }
    if (studentId === "No") {
      if (second) {
        selectedBatch.classLeader = null;
      } else {
        selectedBatch.classLeader2 = null;
      }
      
      await selectedBatch.save();
      
      return res.status(200).json({
        status: true,
        message: "Class Leader removed successfully",
        selectedBatch,
      });
      
    }
    
    if(second){
      selectedBatch.classLeader2 = mongoose.Types.ObjectId.isValid(studentId) ? studentId : null;
    }else{
      selectedBatch.classLeader = mongoose.Types.ObjectId.isValid(studentId) ? studentId : null;
    }
    
     
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Class Leader assigned successfully", selectedBatch });
  } catch (error) {
     res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignsemester = async (req, res) => {
   try {
    const {classId, semesterId, art} = req.body;
    
    const selectedBatch = await Batch.findById(classId);
    if(!selectedBatch){
     return res.status(404).json({status: false, message:"Batch not found"});
    }
    if(art){
    selectedBatch.currentArtSemester = mongoose.Types.ObjectId.isValid(semesterId) ? semesterId : null;
    }else{
    selectedBatch.currentSemester = mongoose.Types.ObjectId.isValid(semesterId) ? semesterId : null;
    }
     
    await selectedBatch.save();

    res.status(200).json({ status: true, message: "Semester assigned successfully", selectedBatch });
  } catch (error) {
     res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export const asignSubteacher = async (req, res) => {
  try {
    const { subjectId, teacherId, second = false, art = false } = req.body;
    let subject;
    if(art){
        subject = await ArtSubject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found" });
    }
    }else{
        subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found" });
    }
    }
   

    if (teacherId === "No") {
      if (second) {
        subject.subTeacher2 = null;
      } else {
        subject.subTeacher = null;
      }
      
      await subject.save();
      
      return res.status(200).json({
        status: true,
        message: "Subject teacher removed successfully",
        subject,
      });
      
    }

    // Validate the teacher
    const teacher = await Staff.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ status: false, message: "Teacher not found" });
    }

    // Assign the teacher
    if (second) {
      subject.subTeacher2 = teacherId;
    } else {
      subject.subTeacher = teacherId;
    }

    await subject.save();

    res.status(200).json({
      status: true,
      message: "Subject teacher assigned successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const asignSubteacherPeriod = async (req, res) => {
  try {
    const { subjectId, period, second = false, art = false } = req.body;

    let subject;
    if(art){
        subject = await ArtSubject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found" });
    }
    }else{
        subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ status: false, message: "Subject not found" });
    }
    }

    if (period === 0) {
      if (second) {
        subject.periodTeacher2 = null;
      } else {
        subject.periodTeacher1 = null;
      }
      
      await subject.save();
      
      return res.status(200).json({
        status: true,
        message: "Subject Period removed successfully",
        subject,
      });
      
    }


    // Assign the Period
    if (second) {
      subject.periodTeacher2 = period;
    } else {
      subject.periodTeacher1 = period;
    }

    await subject.save();

    res.status(200).json({
      status: true,
      message: "Subject Period assigned successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const assignedSubjects = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const subjects = await Subject.aggregate([
      {
        $match: {
          $or: [
            { subTeacher: new mongoose.Types.ObjectId(teacherId) },
            { subTeacher2: new mongoose.Types.ObjectId(teacherId) }
          ]
        }
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
          preserveNullAndEmptyArrays: true 
        }
      }
    ]);

    const artSubjects = await ArtSubject.aggregate([
      {
        $match: {
          $or: [
            { subTeacher: new mongoose.Types.ObjectId(teacherId) },
            { subTeacher2: new mongoose.Types.ObjectId(teacherId) }
          ]
        }
      },
      {
        $lookup: {
          from: "batches",
          let: { semesterId: "$artSemester" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$currentArtSemester",
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
                currentArtSemester: 1
              }
            }
          ],
          as: "batchDetails"
        }
      },
      {
        $unwind: {
          path: "$batchDetails",
          preserveNullAndEmptyArrays: true 
        }
      }
    ]);

    const combined = [...subjects, ...artSubjects];

    return res.status(200).json(combined);
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
        $lookup: {
          from: "staffs",
          localField: "subTeacher2",
          foreignField: "_id",
          as: "subTeacher2Info"
        }
      },
      {
        $project: {
          name: 1,
          mark: 1,
          CEmark: 1,
          "subTeacherInfo.name": 1,
          "subTeacher2Info.name": 1
        }
      }
    ]);
    const artSubjects = await ArtSubject.aggregate([
      {
        $match: { artSemester: batch.currentArtSemester }
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
        $lookup: {
          from: "staffs",
          localField: "subTeacher2",
          foreignField: "_id",
          as: "subTeacher2Info"
        }
      },
      {
        $project: {
          name: 1,
          mark: 1,
          CEmark: 1,
          "subTeacherInfo.name": 1,
          "subTeacher2Info.name": 1
        }
      }
    ]);
    
    const combined = [...subjects, ...artSubjects];

    return res.status(200).json(combined);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const postAttendance = async (req, res) => {
try {
  let {attendance, classId, date} = req.body;

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

let response = await Batch.updateOne(
  { _id: classId },
  { $set: { [`attendance.${monthName}.${day}`]: attendance } }
);


 res.status(200).json({ message: "Attendance marked successfully!" });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

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



