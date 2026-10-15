import Student from "../models/student.model.js";
import Batch from "../models/batch.model.js";
import Staff from "../models/staff.model.js";
import Record from "../models/records.model.js";
import Book from "../models/book.model.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const inactiveBatches = await Batch.find({ isActive: false }).select("_id name");
    const inactiveBatchIds = inactiveBatches.map(b => b._id);
    const inactiveBatchNames = inactiveBatches.map(b => b.name);

    const [totalStudents, activeBatchesCount, totalStaff, totalRecords, totalBooks, alumniStudents] = await Promise.all([
      Student.countDocuments(),
      Batch.countDocuments({ isActive: { $ne: false } }),
      Staff.countDocuments({ isActive: { $ne: false } }),
      Record.countDocuments(),
      Book.countDocuments(),
      Student.countDocuments({
        $or: [
          { batchId: { $in: inactiveBatchIds } },
          { batchName: { $in: inactiveBatchNames } }
        ]
      })
    ]);

    const activeStudents = Math.max(0, totalStudents - alumniStudents);

    res.status(200).json({
      totalStudents: activeStudents,
      allStudentsCount: totalStudents,
      totalAlumni: alumniStudents,
      totalBatches: activeBatchesCount,
      allBatchesCount: inactiveBatches.length + activeBatchesCount,
      totalStaff,
      totalRecords,
      totalBooks,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
