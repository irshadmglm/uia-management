import express from "express";
import { updateUser, deleteUser, getUser, addUser, getTeachers, getStudents, getStudent, editStudent } from "../controllers/userController.js";

const router = express.Router();


router.get("/", getStudents);

router.get("/teachers", getTeachers);

router.get("/student/:studentId", getStudent);

router.put("/student/edit/:studentId", editStudent);

router.post("/add", addUser);

router.put("/edit", updateUser); 

router.delete("/delete/:userId", deleteUser); 

router.get("/:batchId", getStudents);

// router.get('/:userId', getUser)






export default router;


