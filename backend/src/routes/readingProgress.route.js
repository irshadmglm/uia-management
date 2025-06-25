import express from "express";
import { deleteStdReadingProgress, editStdReadingProgress, getStdReadingProgress, postStdReadingProgress } from "../controllers/readingProgressController.js";
import { getToApprove } from "../controllers/achivementsController.js";

const router = express.Router();

router.get("/toApprove/:batchId", getToApprove)

router.get("/:studentId", getStdReadingProgress);

router.post("/:studentId", postStdReadingProgress);

router.put("/:recordId", editStdReadingProgress);

router.delete("/:recordId", deleteStdReadingProgress)


export default router;