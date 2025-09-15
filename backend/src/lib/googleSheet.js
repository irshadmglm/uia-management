import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
// IMPORTANT: Make sure you have a 'googleSheet.json' file with your credentials in the same directory.
// IMPORTANT: Set your Spreadsheet ID in your environment variables (e.g., in a .env file).
const credentialsPath = path.join(__dirname, "googleSheet.json");
const spreadsheetId = process.env.SPREADSHEET_ID;

// --- Pre-flight Checks ---
if (!fs.existsSync(credentialsPath)) {
    console.error(`Error: Credentials file not found at ${credentialsPath}`);
    console.error("Please ensure 'googleSheet.json' exists in the same directory.");
    process.exit(1);
}
if (!spreadsheetId) {
    console.error("Error: SPREADSHEET_ID environment variable is not set.");
    console.error("Please set this variable to your Google Sheet's ID.");
    process.exit(1);
}

let credentials;
try {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
} catch (error) {
    console.error("Failed to read or parse googleSheet.json:", error.message);
    process.exit(1);
}

/**
 * Creates and returns an authenticated Google Auth client.
 * @returns {Promise<import('google-auth-library').GoogleAuth>} The authenticated Google Auth client.
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
    /**
     * Reads all data from a specified sheet and returns it as an array of objects.
     * It assumes headers are on the second row and data starts on the third.
     * @param {string} sheetName - The name of the sheet to read from (e.g., "BATCH 09").
     * @returns {Promise<Object[]>} An array of objects, where each object represents a row.
     */
    async readAll(sheetName) {
        try {
            console.log(`Reading all rows from sheet: ${sheetName}`);
            const auth = await getAuth();
            const sheets = google.sheets({ version: "v4", auth });

            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:T`, // Read a wide enough range
            });

            const rows = res.data.values || [];
            // Expect at least a title row, a header row, and one data row.
            if (rows.length < 3) {
                console.warn("No data found or sheet format is incorrect (expected headers on row 2).");
                return [];
            }

            const headers = rows[1]; // Headers are on the second row (index 1)
            const dataRows = rows.slice(2); // Data starts from the third row (index 2)

            const data = dataRows
                .map((row, index) => {
                    // Filter out empty rows or rows that are not data (like 'TOTAL')
                    // Assuming 'SL NO' (first column) must have a value for a valid data row.
                    if (!row[0] || row[0].toString().toUpperCase().includes('TOTAL')) {
                        return null;
                    }

                    const rowData = {
                        rowIndex: index + 3 // Row index in the sheet (e.g., index 0 is row 3)
                    };

                    headers.forEach((header, i) => {
                        if (header) { // Only map columns that have a header title.
                            rowData[header] = row[i] || "";
                        }
                    });
                    return rowData;
                })
                .filter(row => row !== null); // Remove the filtered-out null entries

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

        // Step 1: Get the headers to ensure correct column order.
        // Assumes headers are in row 2. Adjust if yours are in row 1 (A1:T1).
        const headerRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A2:T2`, 
        });

        const headers = headerRes.data.values?.[0];
        if (!headers) {
            throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);
        }

        // Step 2: Map the data object to an array in the correct order.
        // Any column in your sheet that isn't in dataToUpdate will be sent as an empty string.
        const values = headers.map(header => dataToUpdate[header] ?? "");

        // Step 3: Define the exact range to update (e.g., 'BATCH 09'!A5:T5)
        const range = `${sheetName}!A${rowIndex}:T${rowIndex}`;

        // Step 4: Execute the update request.
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

    /**
     * Inserts a new row of data into the specified sheet.
     * @param {string} sheetName - The name of the sheet to insert into.
     * @param {Object} data - An object representing the row data. Keys should match the sheet headers.
     * @returns {Promise<{success: boolean}>} An object indicating the success of the operation.
     */
    async insert(sheetName, data) {
        try {
            console.log(`Inserting row into sheet: ${sheetName}`, data);
            const auth = await getAuth();
            const sheets = google.sheets({ version: "v4", auth });

            // Get the headers from the correct row (row 2) to ensure order
            const headerRes = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A2:T2`,
            });
            const headers = headerRes.data.values?.[0];
            if (!headers) {
                throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);
            }

            // Create the row array in the correct order based on headers
            const values = headers.map(header => data[header] || "");

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

    

    /**
     * Updates an existing row in the sheet, identified by a unique key.
     * @param {string} sheetName - The name of the sheet.
     * @param {string} uniqueKey - The header name to use as a unique identifier (e.g., "CIC NO").
     * @param {string|number} uniqueValue - The value of the unique key for the row to update.
     * @param {Object} dataToUpdate - An object containing the new data for the row. Keys must match headers.
     * @returns {Promise<{success: boolean}>} An object indicating the success of the operation.
     */
    async update(sheetName, uniqueKey, uniqueValue, dataToUpdate) {
        try {
            console.log(`Updating row where ${uniqueKey}=${uniqueValue} in sheet: ${sheetName}`);
            const allData = await this.readAll(sheetName);
            const rowToUpdate = allData.find(row => row[uniqueKey] == uniqueValue);

            if (!rowToUpdate) {
                throw new Error(`Row with ${uniqueKey} = ${uniqueValue} not found.`);
            }

            const auth = await getAuth();
            const sheets = google.sheets({ version: "v4", auth });

            const headerRes = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A2:T2`,
            });
            const headers = headerRes.data.values?.[0];
            if (!headers) {
                throw new Error(`Could not retrieve headers from sheet "${sheetName}".`);
            }

            // Merge existing data with new data
            const updatedRowData = { ...rowToUpdate, ...dataToUpdate };

            // Create the row array in the correct order based on headers
            const values = headers.map(header => updatedRowData[header] || "");

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

    /**
     * Deletes a row from the sheet, identified by a unique key.
     * @param {string} sheetName - The name of the sheet.
     * @param {string} uniqueKey - The header name to use as a unique identifier (e.g., "CIC NO").
     * @param {string|number} uniqueValue - The value of the unique key for the row to delete.
     * @returns {Promise<{success: boolean}>} An object indicating the success of the operation.
     */
    async delete(sheetName, uniqueKey, uniqueValue) {
        try {
            console.log(`Deleting row where ${uniqueKey}=${uniqueValue} from sheet: ${sheetName}`);
            const allData = await this.readAll(sheetName);
            const rowToDelete = allData.find(row => row[uniqueKey] == uniqueValue);

            if (!rowToDelete) {
                throw new Error(`Row with ${uniqueKey} = ${uniqueValue} not found.`);
            }

            const auth = await getAuth();
            const sheets = google.sheets({ version: "v4", auth });

            // We need the sheetId for the deleteDimension request
            const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
            const sheet = spreadsheetMeta.data.sheets.find(s => s.properties.title === sheetName);
            if (!sheet) {
                throw new Error(`Sheet with name "${sheetName}" not found.`);
            }
            const sheetId = sheet.properties.sheetId;

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: sheetId,
                                dimension: "ROWS",
                                startIndex: rowToDelete.rowIndex - 1, // API is 0-indexed
                                endIndex: rowToDelete.rowIndex,
                            },
                        },
                    }, ],
                },
            });

            return { success: true };
        } catch (error) {
            console.error(`Error deleting row from sheet "${sheetName}":`, error.message);
            throw error;
        }
    }

    /**
     * Finds all rows that match a specific query.
     * @param {string} sheetName - The name of the sheet to search in.
     * @param {Object} query - An object of key-value pairs to match (e.g., { NAME: "AHMED MISHAB" }).
     * @returns {Promise<Object[]>} An array of matching row objects.
     */
    async find(sheetName, query) {
        try {
            console.log(`Finding rows in sheet "${sheetName}" matching:`, query);
            const allRows = await this.readAll(sheetName);
            // Using '==' for loose comparison to handle numbers vs strings from sheets
            return allRows.filter(row =>
                Object.entries(query).every(([key, value]) => row[key] == value)
            );
        } catch (error) {
            console.error(`Error finding in sheet "${sheetName}":`, error.message);
            throw error;
        }
    }

    /**
     * Finds the first row that matches a specific query.
     * @param {string} sheetName - The name of the sheet to search in.
     * @param {Object} query - An object of key-value pairs to match.
     * @returns {Promise<Object|null>} The first matching row object, or null if not found.
     */
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

