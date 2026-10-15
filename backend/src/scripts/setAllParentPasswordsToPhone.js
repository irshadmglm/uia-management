import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Student from "../models/student.model.js";

dotenv.config();

const updateAllParentPasswords = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const students = await Student.find({});
    console.log(`Found ${students.length} total students in database.`);

    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const student of students) {
      if (!student.parentNumber) {
        console.log(`[SKIPPED] ${student.name} (CIC: ${student.cicNumber}) - No parent number`);
        skippedCount++;
        continue;
      }

      const cleanPhone = String(student.parentNumber).trim().replace(/[\s\-\(\)]/g, "");

      if (cleanPhone.length < 5) {
        console.log(`[SKIPPED] ${student.name} (CIC: ${student.cicNumber}) - Invalid parent number length: "${cleanPhone}"`);
        skippedCount++;
        continue;
      }

      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPhone, salt);

        student.parentPassword = hashedPassword;
        await student.save();

        updatedCount++;
        if (updatedCount <= 5 || updatedCount % 20 === 0) {
          console.log(`[UPDATED ${updatedCount}] ${student.name} - Parent Phone: ${cleanPhone}`);
        }
      } catch (err) {
        console.error(`Error updating ${student.name}:`, err.message);
        errors.push({ name: student.name, error: err.message });
      }
    }

    console.log("\n================ SUMMARY ================");
    console.log(`Total Students Scanned: ${students.length}`);
    console.log(`Parent Passwords Set:   ${updatedCount}`);
    console.log(`Skipped (No Phone):     ${skippedCount}`);
    console.log(`Errors:                 ${errors.length}`);
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

updateAllParentPasswords();
