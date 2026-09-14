import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import SheetsDB from './src/lib/googleSheet.js';

const db = new SheetsDB();

async function checkStudent() {
  const targetCic = '3333';
  const knownBatches = ['BATCH 09', 'BATCH 10', 'BATCH 11', 'BATCH 12', 'BATCH 13', 'BATCH 14'];
  
  for (const batch of knownBatches) {
    try {
      console.log(`Checking ${batch}...`);
      const allStudents = await db.readAll(batch);
      console.log(`Found ${allStudents.length} rows in ${batch}`);
      
      const student = allStudents.find(item => item && item["CIC NO"] !== undefined && String(item["CIC NO"]).trim() === targetCic);
      
      if (student) {
        console.log(`✅ FOUND in ${batch}:`, student);
        return;
      }
    } catch (e) {
      console.error(`Error reading ${batch}:`, e.message);
    }
  }
  
  console.log(`❌ Student with CIC ${targetCic} NOT FOUND in any batch.`);
}

checkStudent();
