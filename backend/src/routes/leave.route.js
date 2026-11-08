import express from "express";
import { getLeaveStatus, getLeaveBatches, updateLeave, addStudent, deleteStudent } from "../controllers/leaveController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/batches", protectRoute, getLeaveBatches);
router.get("/status", protectRoute, getLeaveStatus);
router.put("/update", protectRoute, updateLeave);
router.post("/add", protectRoute, addStudent);
router.post("/delete", protectRoute, deleteStudent);

export default router;