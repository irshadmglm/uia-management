import express from "express";
import { getLeaveStatus, getLeaveBatches, updateLeave, addStudent, deleteStudent } from "../controllers/leaveController.js";

const router = express.Router();

router.get("/batches", getLeaveBatches);
router.get("/status", getLeaveStatus);
router.put("/update", updateLeave);
router.post("/add", addStudent);
router.post("/delete", deleteStudent); // Using POST for delete to send body easily

export default router;