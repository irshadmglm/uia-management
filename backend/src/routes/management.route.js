import express from "express";
import { asignBatchTeacher, asignClassLeader, asignsemester,  asignSubteacher,  assignedSubjects,  CELinkUpdate,  curruntSemSubjects,  getAssignedBatch,  getAttendance,  getBatch,  getBatches, getSemesters, getSubjects, getTimetable, IRLinkUpdate, postAttendance, postbatches, postSemester, postSubject, postTimetable } from "../controllers/mngController.js";


const router = express.Router();

router.get('/timetable', getTimetable);

router.post('/timetable', postTimetable);

router.get('/curriculum', getSemesters);

router.post('/curriculum', postSemester);

router.get('/batches', getBatches);

router.get('/class/:teacherId', getAssignedBatch)

router.get('/batch/:batchId', getBatch)

router.post('/batches', postbatches)

router.get('/subjects/:semesterId', getSubjects)

router.post('/subjects/:semesterId', postSubject)

router.post('/asign-teacher', asignBatchTeacher)

router.post('/asign-semester', asignsemester)

// router.post('/asign-subject', asignSubject)

router.post('/asign-subteacher', asignSubteacher)

router.get('/assigned-subjects/:teacherId', assignedSubjects)

router.post('/asign-class-leader', asignClassLeader)

router.post('/mark-attendance', postAttendance)

router.get('/mark-attendance', getAttendance)

router.patch('/update-ce-link', CELinkUpdate)

router.patch('/update-ir-link', IRLinkUpdate)

router.get('/currunt-sem-subjects/:batchId', curruntSemSubjects )



export default router;
