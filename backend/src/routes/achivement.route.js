import express from "express";
import { deleteStdAchivement, editStdAchivement, getStdAchivement, getToApprove, postStdAchivement } from "../controllers/achivementsController.js";

const router = express.Router();

router.get("toApprove/:batchId", getToApprove)

router.get("/:studentId", getStdAchivement);

router.post("/:studentId", postStdAchivement);

router.put("/:achivemnetId", editStdAchivement);

router.delete("/:achivemnetId", deleteStdAchivement)

export default router;