import SheetsDB from "../lib/googleSheet.js";
import Fee from "../models/fees.model.js";
const db = new SheetsDB();


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

export const assignFeesToBatch = async (req, res) => {
  try {     
    const { batchId, FeeStructure } = req.body;
    if (!batchId || !FeeStructure) {
      return res.status(400).json({ message: 'Batch ID and Fee Structure are required' });
    }
    

    const createdFees = await Fee.insertMany(fees);
    res.status(201).json({ message: 'Fees assigned successfully'});
  } catch (error) {               
    console.error(error);
    res.status(500).json({ message: 'Error assigning fees' });
  }   
};

// Assuming 'db' is your imported module for reading data, e.g., from Google Sheets.
// import * as db from '../utils/googleSheets.js'; 

export const getDashboardAnalytics = async (req, res) => {
  try {
    const batchNames = ['BATCH 09', 'BATCH 10', 'BATCH 11', 'BATCH 12', 'BATCH 13', 'BATCH 14'];
    
    // An array of the keys for monthly payments to make summing them up easier.
    const paymentKeys = ['SHAW', 'DUL_Q', 'DUL_H', 'MUH', 'SAF', 'RA_A', 'RA_AK', 'JUM_U', 'JUM_A', 'RAJ', 'SHAH', 'RAML'];

    // --- Step 1: Fetch and Structure Data for All Batches ---
    // We use Promise.all to fetch data from all sheets concurrently for better performance.
    const allBatchPromises = batchNames.map(name => db.readAll(name));
    const results = await Promise.all(allBatchPromises);

    let allStudents = [];
    results.forEach((batchData, index) => {
      const currentBatchName = batchNames[index];
      const structuredData = batchData.map(item => ({
        batchName: currentBatchName,
        cicNumber: item["CIC NO"],
        name: item.NAME,
        subscription: {
          perYear: Number(item["ISHTIRAK PER YEAR"]) || 0,
          balance: Number(item.BALANCE) || 0,
        },
        payments: {
          SHAW: Number(item.SHAW) || 0,
          DUL_Q: Number(item["DUL Q"]) || 0,
          DUL_H: Number(item["DUL H"]) || 0,
          MUH: Number(item.MUH) || 0,
          SAF: Number(item.SAF) || 0,
          RA_A: Number(item["RA A"]) || 0,
          RA_AK: Number(item["RA AK"]) || 0,
          JUM_U: Number(item["JUM U"]) || 0,
          JUM_A: Number(item["JUM A"]) || 0,
          RAJ: Number(item.RAJ) || 0,
          SHAH: Number(item.SHAH) || 0,
          RAML: Number(item.RAML) || 0,
        },
      }));
      allStudents.push(...structuredData);
    });

    // --- Step 2: Initialize Aggregators ---
    const kpi = {
      totalStudents: 0,
      totalRevenueDue: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      defaulterCount: 0,
    };

    const batchSummary = {};
    batchNames.forEach(name => {
      batchSummary[name] = { due: 0, collected: 0, studentCount: 0, defaulterCount: 0 };
    });

    const monthlyCollection = {};
    paymentKeys.forEach(key => { monthlyCollection[key] = 0; });
    
    let defaultersList = [];

    // --- Step 3: Process All Students in a Single Loop ---
    for (const student of allStudents) {
      const totalPaidByStudent = Object.values(student.payments).reduce((sum, amount) => sum + amount, 0);

      // Aggregate KPI data
      kpi.totalStudents++;
      kpi.totalRevenueDue += student.subscription.perYear;
      kpi.totalCollected += totalPaidByStudent;
      kpi.totalOutstanding += student.subscription.balance;

      if (student.subscription.balance > 0) {
        kpi.defaulterCount++;
        defaultersList.push({
          name: student.name,
          cicNumber: student.cicNumber,
          batchName: student.batchName,
          balance: student.subscription.balance,
        });
      }

      // Aggregate Batch Summary data
      if (batchSummary[student.batchName]) {
        batchSummary[student.batchName].due += student.subscription.perYear;
        batchSummary[student.batchName].collected += totalPaidByStudent;
        batchSummary[student.batchName].studentCount++;
        if (student.subscription.balance > 0) {
          batchSummary[student.batchName].defaulterCount++;
        }
      }
      
      // Aggregate Monthly collection data
      for (const key of paymentKeys) {
        monthlyCollection[key] += student.payments[key] || 0;
      }
    }

    // --- Step 4: Finalize Data for Charts and Tables ---
    
    // Sort defaulters by the highest balance and take the top 10
    const topDefaulters = defaultersList
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);
      
    // Format chart data from the summary objects
    const collectionByBatchChart = Object.entries(batchSummary).map(([name, data]) => ({
      batchName: name,
      due: data.due,
      collected: data.collected,
    }));
    
    const defaultersByBatchChart = Object.entries(batchSummary).map(([name, data]) => ({
      batchName: name,
      defaulterCount: data.defaulterCount,
    }));

    const collectionByMonthChart = Object.entries(monthlyCollection).map(([month, amount]) => ({
      month: month,
      collected: amount,
    }));
    
    const batchSummaryTable = Object.entries(batchSummary).map(([name, data]) => ({
      batchName: name,
      ...data,
      outstanding: data.due - data.collected
    }));


    // --- Step 5: Construct Final Response Object ---
    const dashboardData = {
      kpi,
      charts: {
        collectionByBatch: collectionByBatchChart,
        defaultersByBatch: defaultersByBatchChart,
        collectionByMonth: collectionByMonthChart,
        overallPaymentStatus: {
           collected: kpi.totalCollected,
           outstanding: kpi.totalOutstanding
        }
      },
      tables: {
        topDefaulters,
        batchSummary: batchSummaryTable
      }
    };
    
    res.status(200).json(dashboardData);

  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({ message: "Error fetching dashboard analytics" });
  }
};

export const getFeesByBatch = async (req, res) => {
  try {
    const {batch_name} = req.query;
    const fees = await Fee.find({ batchId: req.query.batchId });
    
  const data = await db.readAll(batch_name);

const structuredData = data.map(item => ({
  cicNumber: item["CIC NO"],
  name: item.NAME,
  contact: item["CONTACT NO"],
  subscription: {
    perYear: item["ISHTIRAK PER YEAR"],
    oldBalance: item["OLD BALANCE"],
    balance: item.BALANCE
  },
  payments: {
    SHAW: item.SHAW,
    DUL_Q: item["DUL Q"],
    DUL_H: item["DUL H"],
    MUH: item.MUH,
    SAF: item.SAF,
    RA_A: item["RA A"],
    RA_AK: item["RA AK"],
    JUM_U: item["JUM U"],
    JUM_A: item["JUM A"],
    RAJ: item.RAJ,
    SHAH: item.SHAH,
    RAML: item.RAML
  }
}));



    res.status(200).json(structuredData);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Error fetching fees' });
  }
};

export const getFeeByStudent = async (req, res) => {
  try {
    // Destructure both batch_name and cicNumber from the query parameters
    const { batch_name, cicNumber } = req.query;

    // Check if both required parameters are provided
    if (!batch_name || !cicNumber) {
      return res.status(400).json({ message: 'Batch name and CIC number are required.' });
    }
    
    // Read all student data from the specified batch
    const allStudents = await db.readAll(batch_name);

    // Find the specific student by their CIC number
    // We compare them as strings to avoid type issues (e.g., "101" vs 101)
    const student = allStudents.find(item => String(item["CIC NO"]) === String(cicNumber));

    // If no student is found with that CIC number, return a 404 error
    if (!student) {
      return res.status(404).json({ message: 'Student not found in this batch.' });
    }

    // If the student is found, structure their data
    const structuredData = {
      cicNumber: student["CIC NO"],
      name: student.NAME,
      contact: student["CONTACT NO"],
      subscription: {
        perYear: student["ISHTIRAK PER YEAR"],
        oldBalance: student["OLD BALANCE"],
        balance: student.BALANCE
      },
      payments: {
        SHAW: student.SHAW,
        DUL_Q: student["DUL Q"],
        DUL_H: student["DUL H"],
        MUH: student.MUH,
        SAF: student.SAF,
        RA_A: student["RA A"],
        RA_AK: student["RA AK"],
        JUM_U: student["JUM U"],
        JUM_A: student["JUM A"],
        RAJ: student.RAJ,
        SHAH: student.SHAH,
        RAML: student.RAML
      }
    };

    // Send the structured data for the single student
    res.status(200).json(structuredData);

  } catch (error) {
    console.error('Error fetching student fee:', error); // Use console.error for better logging
    res.status(500).json({ message: 'Internal server error while fetching student fee' });
  }
};

/**
 * Updates a specific month's payment for a student and recalculates their balance.
 */
export const updateFeeStatus = async (req, res) => {
    try {
        // --- 1. Extract Data ---
        const { cicNumber } = req.params;
        const { batch_name } = req.query;
        // The frontend sends the entire updated student object in the body
        const updatedDataFromClient = req.body;

        // --- 2. Validate Input ---
        if (!batch_name || !updatedDataFromClient || Object.keys(updatedDataFromClient).length === 0) {
            return res.status(400).json({ message: "Missing batch_name in query or student data in body." });
        }

        // --- 3. Find the Student's Row in the Sheet ---
        // IMPORTANT: Your db.readAll function must add a `rowIndex` property to each object
        // so you know which row to update in the Google Sheet.
        const allStudents = await db.readAll(batch_name);
        const studentToUpdate = allStudents.find(student => student["CIC NO"] === cicNumber);

        if (!studentToUpdate) {
            return res.status(404).json({ message: 'Student not found in the specified batch.' });
        }
        
        const sheetRowIndex = studentToUpdate.rowIndex;
        if (!sheetRowIndex) {
            return res.status(500).json({ message: 'Database integration error: rowIndex not found. Cannot update.' });
        }

        // --- 4. Map Frontend Data to Your Sheet Column Headers ---
        // This creates an object with the exact column names as keys, which your db helper needs.
        const updatedRowForSheet = {
            "SL NO": studentToUpdate.rowIndex - 2,
            "NAME": updatedDataFromClient.name,
            "CIC NO": updatedDataFromClient.cicNumber,
            // Only update the fields that can be edited
            "CONTACT NO": updatedDataFromClient.contact,
            "ISHTIRAK PER YEAR": updatedDataFromClient.subscription.perYear,
            "OLD BALANCE": updatedDataFromClient.subscription.oldBalance,
            "BALANCE": updatedDataFromClient.subscription.balance, // We trust the frontend's calculation
            "SHAW": updatedDataFromClient.payments.SHAW,
            "DUL Q": updatedDataFromClient.payments.DUL_Q,
            "DUL H": updatedDataFromClient.payments.DUL_H,
            "MUH": updatedDataFromClient.payments.MUH,
            "SAF": updatedDataFromClient.payments.SAF,
            "RA A": updatedDataFromClient.payments.RA_A,
            "RA AK": updatedDataFromClient.payments.RA_AK,
            "JUM U": updatedDataFromClient.payments.JUM_U,
            "JUM A": updatedDataFromClient.payments.JUM_A,
            "RAJ": updatedDataFromClient.payments.RAJ,
            "SHAH": updatedDataFromClient.payments.SHAH,
            "RAML": updatedDataFromClient.payments.RAML,
        };

        // --- 5. Persist Changes to the Database ---
        // Your db.updateRow function will use the sheet name, row index, and the updated data.
       await db.updateRow(batch_name, sheetRowIndex, updatedRowForSheet);

        // --- 6. Send Success Response ---
        res.status(200).json({
            message: 'Fee status updated successfully.',
            data: updatedDataFromClient // Send back the data for frontend state consistency
        });

    } catch (error) {
        console.error("Error updating fee status:", error);
        res.status(500).json({ message: 'An error occurred on the server while updating.' });
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

