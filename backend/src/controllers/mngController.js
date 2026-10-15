/**
 * Management Controllers (Unified Barrel Export)
 * 
 * Modular domain controllers:
 * - timetableController.js   -> Timetable scheduling
 * - semesterController.js    -> Regular & Art semesters (unified Semester collection)
 * - batchController.js       -> Batches, teacher assignments, class leaders, links, archiving
 * - subjectController.js     -> Regular & Art subjects, teacher period assignments, aggregations
 * - attendanceController.js  -> Structured attendance model with dual-write compatibility
 * - dashboardController.js   -> College overview & metric counts
 */

export * from "./timetableController.js";
export * from "./semesterController.js";
export * from "./batchController.js";
export * from "./subjectController.js";
export * from "./attendanceController.js";
export * from "./dashboardController.js";
