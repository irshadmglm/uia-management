import express from "express";
import { asignBatchTeacher, asignClassLeader, asignsemester,  asignSubteacher,  assignedSubjects,  CELinkUpdate,  curruntSemSubjects,  deleteBatch,  deleteSemester,  deleteSubject,  getAssignedBatch,  getAttendance,  getBatch,  getBatches, getSemesters, getSubjects, getTimetable, IRLinkUpdate, postAttendance, postbatches, postSemester, postSubject, postTimetable, updateBatch, updateSemester, updateSubject } from "../controllers/mngController.js";


const router = express.Router();

router.get('/timetable', getTimetable);

router.post('/timetable', postTimetable);

router.get('/semester', getSemesters);

router.post('/semester', postSemester);

router.delete('/semester/delete/:semesterId', deleteSemester);

router.put('/semester/update/:semesterId', updateSemester);

router.get('/batches', getBatches);

router.delete('/batch/delete/:batchId', deleteBatch);

router.put('/batch/update/:batchId', updateBatch);

router.get('/class/:teacherId', getAssignedBatch)

router.get('/batch/:batchId', getBatch)

router.post('/batches', postbatches)

router.get('/subjects/:semesterId', getSubjects)

router.post('/subjects/:semesterId', postSubject)

router.delete('/subject/delete/:subjectId', deleteSubject);

router.put('/subject/update/:subjectId', updateSubject);

router.post('/asign-teacher', asignBatchTeacher)

router.post('/asign-semester', asignsemester)

router.post('/asign-subteacher', asignSubteacher)

router.get('/assigned-subjects/:teacherId', assignedSubjects)

router.post('/asign-class-leader', asignClassLeader)

router.post('/mark-attendance', postAttendance)

router.get('/mark-attendance', getAttendance)

router.patch('/update-ce-link', CELinkUpdate)

router.patch('/update-ir-link', IRLinkUpdate)

router.get('/currunt-sem-subjects/:batchId', curruntSemSubjects )



export default router;
