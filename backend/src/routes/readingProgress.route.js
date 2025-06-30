import express from "express";
import { deleteStdReadingProgress, editStdReadingProgress, getCountToApproveByBatch, getCountToApproveByStd, getStdReadingProgress, postStdReadingProgress } from "../controllers/readingProgressController.js";

const router = express.Router();

router.get("count", getCountToApproveByBatch)

router.get("count/:batchId", getCountToApproveByStd)

router.get("/:studentId", getStdReadingProgress);

router.post("/:studentId", postStdReadingProgress);

router.put("/:recordId", editStdReadingProgress);

router.delete("/:recordId", deleteStdReadingProgress)


export default router;