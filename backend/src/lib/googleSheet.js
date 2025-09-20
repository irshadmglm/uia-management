import { google } from "googleapis";

// --- Configuration ---
const spreadsheetId = process.env.SPREADSHEET_ID;
const rawCredentials = process.env.GOOGLE_CREDENTIALS_JSON;

if (!spreadsheetId) {
  console.error("Error: SPREADSHEET_ID environment variable is not set.");
  process.exit(1);
}

if (!rawCredentials) {
  console.error("Error: GOOGLE_CREDENTIALS_JSON environment variable is not set.");
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(rawCredentials);
} catch (error) {
  console.error("Failed to parse GOOGLE_CREDENTIALS_JSON:", error.message);
  process.exit(1);
}

/**
 * Creates and returns an authenticated Google Auth client.
 */
async function getAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return auth;
  } catch (error) {
    console.error("Authentication failed:", error.message);
    throw error;
  }
}

/**
 * A class to interact with a Google Sheet as a simple database.
 * Provides methods for Create, Read, Update, and Delete (CRUD) operations.
 */
class SheetsDB {
  async readAll(sheetName) {
    try {
      console.log(`Reading all rows from sheet: ${sheetName}`);
      const auth = await getAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:T`,
      });

      const rows = res.data.values || [];
      if (rows.length < 3) {
        console.warn("No data found or sheet format is incorrect (expected headers on row 2).");
        return [];
      }

      const headers = rows[1];
      const dataRows = rows.slice(2);

      const data = dataRows
        .map((row, index) => {
          if (!row[0] || row[0].toString().toUpperCase().includes("TOTAL")) {
            return null;
          }

          const rowData = {
            rowIndex: index + 3,
          };

          headers.forEach((header, i) => {
            if (header) {
              rowData[header] = row[i] || "";
            }
          });
          return rowData;
        })
        .filter((row) => row !== null);

      return data;
    } catch (error) {
      console.error(`Error reading data from sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async updateRow(sheetName, rowIndex, dataToUpdate) {
    try {
      console.log(`Updating row index ${rowIndex} in sheet: ${sheetName}`);
      const auth = await getAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:T2`,
      });

      const headers = headerRes.data.values?.[0];
      if (!headers) throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);

      const values = headers.map((header) => dataToUpdate[header] ?? "");
      const range = `${sheetName}!A${rowIndex}:T${rowIndex}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [values] },
      });

      console.log(`Successfully updated row ${rowIndex} in ${sheetName}.`);
      return { success: true };
    } catch (error) {
      console.error(`Error updating row ${rowIndex} in sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async insert(sheetName, data) {
    try {
      console.log(`Inserting row into sheet: ${sheetName}`, data);
      const auth = await getAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:T2`,
      });

      const headers = headerRes.data.values?.[0];
      if (!headers) throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);

      const values = headers.map((header) => data[header] || "");

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:T`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [values] },
      });

      return { success: true };
    } catch (error) {
      console.error(`Error inserting into sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async update(sheetName, uniqueKey, uniqueValue, dataToUpdate) {
    try {
      console.log(`Updating row where ${uniqueKey}=${uniqueValue} in sheet: ${sheetName}`);
      const allData = await this.readAll(sheetName);
      const rowToUpdate = allData.find((row) => row[uniqueKey] == uniqueValue);

      if (!rowToUpdate) throw new Error(`Row with ${uniqueKey} = ${uniqueValue} not found.`);

      const auth = await getAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:T2`,
      });

      const headers = headerRes.data.values?.[0];
      if (!headers) throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);

      const updatedRowData = { ...rowToUpdate, ...dataToUpdate };
      const values = headers.map((header) => updatedRowData[header] || "");
      const range = `${sheetName}!A${rowToUpdate.rowIndex}:T${rowToUpdate.rowIndex}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [values] },
      });

      return { success: true };
    } catch (error) {
      console.error(`Error updating row in sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async delete(sheetName, uniqueKey, uniqueValue) {
    try {
      console.log(`Deleting row where ${uniqueKey}=${uniqueValue} from sheet: ${sheetName}`);
      const allData = await this.readAll(sheetName);
      const rowToDelete = allData.find((row) => row[uniqueKey] == uniqueValue);

      if (!rowToDelete) throw new Error(`Row with ${uniqueKey} = ${uniqueValue} not found.`);

      const auth = await getAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
      const sheet = spreadsheetMeta.data.sheets.find((s) => s.properties.title === sheetName);
      if (!sheet) throw new Error(`Sheet with name "${sheetName}" not found.`);

      const sheetId = sheet.properties.sheetId;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: "ROWS",
                  startIndex: rowToDelete.rowIndex - 1,
                  endIndex: rowToDelete.rowIndex,
                },
              },
            },
          ],
        },
      });

      return { success: true };
    } catch (error) {
      console.error(`Error deleting row from sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async find(sheetName, query) {
    try {
      console.log(`Finding rows in sheet "${sheetName}" matching:`, query);
      const allRows = await this.readAll(sheetName);
      return allRows.filter((row) =>
        Object.entries(query).every(([key, value]) => row[key] == value)
      );
    } catch (error) {
      console.error(`Error finding in sheet "${sheetName}":`, error.message);
      throw error;
    }
  }

  async findOne(sheetName, query) {
    try {
      console.log(`Finding one row in sheet "${sheetName}" matching:`, query);
      const results = await this.find(sheetName, query);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error finding one in sheet "${sheetName}":`, error.message);
      throw error;
    }
  }
}

export default SheetsDB;
