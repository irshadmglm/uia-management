import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const LEAVE_SHEET_ID = '1_0yRX5PWjLilmJgc0nx3DERvXu-TbYMWKMefceBEFQg'; 

const getDoc = async () => {
  const doc = new GoogleSpreadsheet(LEAVE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
};

const DATA_START_ROW = 5;

// 1. GET DATA
export const getLeaveStatus = async (req, res) => {
  const { batchName } = req.query;
  if (!batchName) return res.status(400).json({ message: "Batch required" });

  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle[batchName];
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    const rows = await sheet.getRows({ offset: 3 }); 

    const formattedData = rows.map((row, index) => {
        const raw = row._rawData || [];
        const realRowIndex = index + DATA_START_ROW;

        return {
            rowIndex: realRowIndex, 
            slNo: raw[0],
            cicNumber: raw[1]?.toString() || "", 
            name: raw[2] || "",
            // November
            novCasual: raw[3] || "0",
            novMedical: raw[4] || "0",
            novCondonation: raw[5] || "0",
            novTotal: raw[6] || "0",
            // May
            mayCasual: raw[7] || "0",
            mayMedical: raw[8] || "0",
            mayCondonation: raw[9] || "0",
            mayTotal: raw[10] || "0",
            // Balance
            balance: raw[11] || "0"
        };
    }).filter(s => s.cicNumber && s.name); 

    const stats = {
        totalStudents: formattedData.length,
        critical: formattedData.filter(s => parseInt(s.balance) <= 5).length,
        safe: formattedData.filter(s => parseInt(s.balance) > 10).length
    };

    res.status(200).json({ success: true, data: formattedData, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. UPDATE DATA (Updates 6 columns: D,E,F and H,I,J)
export const updateLeave = async (req, res) => {
    const { batchName, cicNumber, updates } = req.body;
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle[batchName];
        
        const rows = await sheet.getRows({ offset: 3 });
        const targetIndex = rows.findIndex(r => r._rawData[1]?.toString() === cicNumber.toString());

        if (targetIndex === -1) return res.status(404).json({ message: "Student not found" });

        const rowIndex = targetIndex + DATA_START_ROW;

        // Load ranges: D-F (Nov) and H-J (May)
        // We can load D:J to capture everything in between
        await sheet.loadCells(`D${rowIndex}:J${rowIndex}`);

        // Update November (D, E, F)
        if (updates.novCasual !== undefined) sheet.getCellByA1(`D${rowIndex}`).value = parseInt(updates.novCasual) || 0;
        if (updates.novMedical !== undefined) sheet.getCellByA1(`E${rowIndex}`).value = parseInt(updates.novMedical) || 0;
        if (updates.novCondonation !== undefined) sheet.getCellByA1(`F${rowIndex}`).value = parseInt(updates.novCondonation) || 0;

        // Update May (H, I, J)
        if (updates.mayCasual !== undefined) sheet.getCellByA1(`H${rowIndex}`).value = parseInt(updates.mayCasual) || 0;
        if (updates.mayMedical !== undefined) sheet.getCellByA1(`I${rowIndex}`).value = parseInt(updates.mayMedical) || 0;
        if (updates.mayCondonation !== undefined) sheet.getCellByA1(`J${rowIndex}`).value = parseInt(updates.mayCondonation) || 0;

        await sheet.saveUpdatedCells();

        res.status(200).json({ success: true, message: "Updated successfully" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Update Failed", error: error.message });
    }
};

// 3. ADD STUDENT
export const addStudent = async (req, res) => {
    const { batchName, name, cicNumber } = req.body;
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle[batchName];
        const rows = await sheet.getRows({ offset: 3 });

        const lastRow = rows[rows.length - 1];
        const nextSl = lastRow && lastRow._rawData[0] ? parseInt(lastRow._rawData[0]) + 1 : 1;

        // Calculate Row Index for Formulas
        const r = rows.length + DATA_START_ROW; 
        
        // Formulas
        const novTotal = `=SUM(D${r}:F${r})`;
        const mayTotal = `=SUM(H${r}:J${r})`;
        const balance = `=15-(G${r}+K${r})`;

        await sheet.addRow([
            nextSl, 
            cicNumber, 
            name, 
            0, 0, 0, novTotal, // Nov Cols
            0, 0, 0, mayTotal, // May Cols
            balance            // Balance
        ]);

        res.status(200).json({ success: true, message: "Student Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Add Failed" });
    }
};

// 4. DELETE STUDENT
export const deleteStudent = async (req, res) => {
    const { batchName, cicNumber } = req.body;
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle[batchName];
        const rows = await sheet.getRows({ offset: 3 });
        
        const row = rows.find(r => r._rawData[1]?.toString() === cicNumber.toString());
        if (!row) return res.status(404).json({ message: "Student not found" });

        await row.delete();
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
};

// 5. GET BATCHES
export const getLeaveBatches = async (req, res) => {
    try {
        const doc = await getDoc();
        const titles = doc.sheetsByIndex.map(s => s.title);
        res.status(200).json({ batches: titles });
    } catch (error) {
        res.status(500).json({ message: "Error fetching batches" });
    }
};