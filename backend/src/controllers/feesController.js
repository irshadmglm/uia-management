import Fee from "../models/fees.model.js";



export const createFee = async (req, res) => {
  try {
    const { studentId, batchId, month, paid } = req.body;
    
    const fee = await Fee.findOneAndUpdate(
      { studentId: studentId, batchId: batchId, month },
      { paid, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating fee' });
  }
}

export const getFeesByBatch = async (req, res) => {
  try {
    const fees = await Fee.find({ batchId: req.query.batchId });
    console.log(fees);
    
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fees' });
  }
};

export const getFeesByStd = async (req, res) => {
  try {
    const { studentId } = req.params;
    const stdFees = await Fee.find({ studentId: studentId });

    res.status(200).json(stdFees); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching fees' });
  }
};


// export const updateMonth = async (req, res) => {
//   try {
//     const { feeId } = req.params;
//     const { month, isPaid, amount } = req.body;
//     if (!isValidId(feeId)) {
//       return res.status(400).json({ error: "Invalid fee ID" });
//     }
//     const updateFields = {};
//     if (typeof isPaid === "boolean") {
//       updateFields["months.$.isPaid"] = isPaid;
//       updateFields["months.$.paidAt"] = isPaid ? new Date() : null;
//     }
//     if (typeof amount === "number") {
//       updateFields["months.$.amount"] = amount;
//     }

//     const fee = await Fee.findOneAndUpdate(
//       { _id: feeId, "months.month": month },
//       { $set: updateFields },
//       { new: true }
//     );
//     if (!fee) return res.status(404).json({ error: "Fee or month not found" });
//     res.json(fee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const payAll = async (req, res) => {
//   try {
//     const { feeId } = req.params;
//     const { isPaid } = req.body;
//     if (!isValidId(feeId) || typeof isPaid !== "boolean") {
//       return res.status(400).json({ error: "Invalid parameters" });
//     }
//     const fee = await Fee.findByIdAndUpdate(
//       feeId,
//       { 
//         $set: { 
//           "months.$[].isPaid": isPaid, 
//           "months.$[].paidAt": isPaid ? new Date() : null 
//         } 
//       },
//       { new: true }
//     );
//     if (!fee) return res.status(404).json({ error: "Fee not found" });
//     res.json(fee);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const deleteFee = async (req, res) => {
//   try {
//     const { feeId } = req.params;
//     if (!isValidId(feeId)) {
//       return res.status(400).json({ error: "Invalid fee ID" });
//     }
//     const fee = await Fee.findByIdAndDelete(feeId);
//     if (!fee) return res.status(404).json({ error: "Fee not found" });
//     res.json({ message: "Fee record deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };
