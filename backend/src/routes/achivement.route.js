import express from "express";
import { editStdAchivement, getStdAchivement, postStdAchivement } from "../controllers/achivementcontroller.js";

const router = express.Router();

router.get("/:studentId", getStdAchivement);

router.post("/:studentId", postStdAchivement);

router.put("/:achivemnetId", editStdAchivement);

export default router;