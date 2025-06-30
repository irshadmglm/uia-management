import express from "express";
import { deleteStdAchivement, editStdAchivement, getCountToApproveByBatch, getCountToApproveByStd, getStdAchivement, postStdAchivement } from "../controllers/achivementsController.js";

const router = express.Router();


router.get("/count", getCountToApproveByBatch)

router.get("/count/:batchId", getCountToApproveByStd)

router.get("/:studentId", getStdAchivement);

router.post("/:studentId", postStdAchivement);

router.put("/:achivemnetId", editStdAchivement);

router.delete("/:achivemnetId", deleteStdAchivement)

export default router;