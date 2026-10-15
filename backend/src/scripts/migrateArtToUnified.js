import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Semester from "../models/semester.model.js";
import Subject from "../models/Subject.model.js";
import ArtSemester from "../models/artsemester.model.js";
import ArtSubject from "../models/artsubject.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function migrateArtToUnified() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not set in environment or .env file.");
    process.exit(1);
  }

  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB.");

  try {
    // 1. Migrate ArtSemester -> Semester (type: 'art')
    console.log("\n📦 Phase 1: Migrating ArtSemesters -> unified Semester collection...");
    const artSemesters = await ArtSemester.find();
    console.log(`Found ${artSemesters.length} ArtSemester document(s).`);

    let semsMigrated = 0;
    for (const sem of artSemesters) {
      await Semester.findByIdAndUpdate(
        sem._id,
        {
          $set: {
            name: sem.name,
            type: "art",
            subjects: sem.subjects || [],
          },
        },
        { upsert: true, new: true }
      );
      semsMigrated++;
    }
    console.log(`✅ Successfully migrated/upserted ${semsMigrated} ArtSemester(s) into Semester collection.`);

    // 2. Migrate ArtSubject -> Subject (type: 'art')
    console.log("\n📦 Phase 2: Migrating ArtSubjects -> unified Subject collection...");
    
    // Check and drop conflicting unique index on 'code' if it exists in subjects collection
    const subjectsColl = mongoose.connection.db.collection("subjects");
    const indexes = await subjectsColl.indexes();
    const codeIndex = indexes.find((idx) => idx.name === "code_1" && idx.unique);
    if (codeIndex) {
      console.log("ℹ️ Found legacy unique index 'code_1'. Dropping to allow existing subjects with duplicate codes to coexist safely...");
      await subjectsColl.dropIndex("code_1");
      console.log("✅ Dropped legacy unique index 'code_1'.");
    }

    const artSubjects = await ArtSubject.find();
    console.log(`Found ${artSubjects.length} ArtSubject document(s).`);

    let subsMigrated = 0;
    for (const sub of artSubjects) {
      await Subject.findByIdAndUpdate(
        sub._id,
        {
          $set: {
            name: sub.name,
            code: sub.code,
            mark: sub.mark,
            CEmark: sub.CEmark,
            type: "art",
            isArtSub: true,
            semester: sub.artSemester,
            artSemester: sub.artSemester,
            subTeacher: sub.subTeacher,
            subTeacher2: sub.subTeacher2,
            subTeacherPeriod: sub.subTeacherPeriod,
            subTeacher2Period: sub.subTeacher2Period,
          },
        },
        { upsert: true, new: true }
      );
      subsMigrated++;
    }
    console.log(`✅ Successfully migrated/upserted ${subsMigrated} ArtSubject(s) into Subject collection.`);

    console.log("\n🎉 Zero-Data-Loss Migration Completed Successfully!");
    console.log("Note: Original ArtSemester and ArtSubject collections have been preserved untouched for safety.");
  } catch (error) {
    console.error("❌ Migration failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

migrateArtToUnified();
