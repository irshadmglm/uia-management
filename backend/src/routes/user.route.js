import express from "express";
import { updateUser, addUser, getTeachers, getStudents, getStudent, editStudent, deleteStudent, editTeacher, deleteTeacher, getTeacher, changeStdStatus, getStudentsInactive, updatePassword } from "../controllers/userController.js";

const router = express.Router();


router.get("/", getStudents);

router.get("/inactive-std", getStudentsInactive);

router.get("/teachers", getTeachers);

router.put("/teacher/update/:teacherId", editTeacher)

router.delete("/teacher/delete/:teacherId", deleteTeacher)

router.get("/teacher/:teacherId", getTeacher);

router.get("/student/:studentId", getStudent);

router.put("/student/edit/:studentId", editStudent);

router.post("/add", addUser);

router.put("/edit", updateUser); 

router.delete("/student/delete/:userId", deleteStudent); 

router.patch("/student/status/:userId", changeStdStatus); 

router.patch("/change-password", updatePassword)

router.get("/:batchId", getStudents);







export default router;


