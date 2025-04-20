import Marklist from "../models/marklist.model.js";
import Semester from "../models/semester.model.js"
import Student from "../models/student.model.js";

export const addMarkList = async (req, res) => {
    try {
        const { studentId, semesterId, markList } = req.body;
 
        if (!studentId || !semesterId || !markList) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student = await Student.findById(studentId);
        console.log(student);
        const cicNumber = Number(student.cicNumber)
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const existingMarklist = await Marklist.findOneAndUpdate(
            { studentId, semesterId }, 
            { 
              subjects: markList, 
              batchId: student.batchId, 
              cicNumber,
              editingStatus: "disable" 
            },
            { new: true, upsert: true } 
          );
          
          await existingMarklist.save();
          
      

        res.status(201).json({ message: "Mark List added successfully" });

    } catch (error) {
        console.error("Error adding mark list:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMarkList = async (req, res) => {
    try {
        const { studentId, semesterId, batchId } = req.query;
        let markList;
        if(studentId && semesterId){
         markList = await Marklist.findOne({ studentId, semesterId});
        }else if(studentId){
         markList = await Marklist.find({ studentId });
        }else if(batchId){
         markList = await Marklist.find({ batchId });
        }
        
        if (markList) {
            return res.status(200).json(markList);
        } else {
            return res.status(200).json([]); 
        }
    } catch (error) {
        console.error("Error fetching mark list:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCountToApprove = async (req, res) => {
    try {
        const pendingMarkLists = await Marklist.find({ isApproved: false });
        console.log("Pending MarkLists:", pendingMarkLists);
        const counts = await Marklist.aggregate([
            { $match: { isApproved: false } }, // ✅ Filter only unapproved mark lists
            { $group: { _id: "$batchId", count: { $sum: 1 } } } // ✅ Group by batchId and count them
        ]);
        console.log(counts);
        
        res.status(200).json(counts);
    } catch (error) {
        console.error("Error fetching count to approve:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateStatus = async (req, res) => {
    try {
      const { status } = req.body; 
      const { marklistId } = req.params;
      console.log(status, marklistId);
      
  
      
      const updatedMarklist = await Marklist.findByIdAndUpdate(
        marklistId,
        {isApproved: status, isEditable: false },
        { new: true }
      );
      
  
      if (!updatedMarklist) {
        return res.status(404).json({ message: "Marklist not found" });
      }
  
      res.status(200).json({
        message: "Status updated successfully",
        marklist: updatedMarklist,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const editAceesRequst = async (req, res) => {
    try {
      
      const { marklistId } = req.params;

       const updatedMarklist = await Marklist.findByIdAndUpdate(
        marklistId,
        {editingStatus: "send" },
        { new: true }
      );
      
      if (!updatedMarklist) {
        return res.status(404).json({ message: "Marklist not found" });
      }
  
      res.status(200).json({
        message: "Edit access requeted successfully",
        marklist: updatedMarklist,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
 export const allowEditAccess = async (req, res) => {
  try {
    const { marklistId } = req.params;

     const updatedMarklist = await Marklist.findByIdAndUpdate(
      marklistId,
      {isApproved: false, isEditable: true, editingStatus: "allow" },
      { new: true }
    );
    
    if (!updatedMarklist) {
      return res.status(404).json({ message: "Marklist not found" });
    }

    res.status(200).json({
      message: "Edit access allowed successfully",
      marklist: updatedMarklist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


