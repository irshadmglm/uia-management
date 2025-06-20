import express from "express";
import { editStdReadingProgress, getStdReadingProgress, postStdReadingProgress } from "../controllers/readingProgressController.js";

const router = express.Router();

router.get("/:studentId", getStdReadingProgress);

router.post("/:studentId", postStdReadingProgress);

router.put("/:recordId", editStdReadingProgress);


export default router;