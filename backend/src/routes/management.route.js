import express from "express";
import { asignBatchTeacher, asignSubject,  getAttendance,  getBatch,  getBatches, getSemesters, getSubjects, getTimetable, postAttendance, postbatches, postSemester, postSubject, postTimetable } from "../controllers/mngController.js";


const router = express.Router();

router.get('/timetable', getTimetable);

router.post('/timetable', postTimetable);

router.get('/curriculum', getSemesters);

router.post('/curriculum', postSemester);

router.get('/batches', getBatches);

router.get('/class/:teacherId', getBatch)

router.post('/batches', postbatches)

router.get('/subjects/:semesterId', getSubjects)

router.post('/subjects/:semesterId', postSubject)

router.post('/asign-teacher', asignBatchTeacher)

router.post('/asign-subject', asignSubject)

router.post('/mark-attendance', postAttendance)

router.get('/mark-attendance', getAttendance)

export default router;
