import express from "express";
import { createFee, getFeesByBatch, getFeesByStd } from "../controllers/feesController.js";

const router = express.Router();

router.post("/", createFee);

router.get("/", getFeesByBatch);

router.get("/get-std-fees/:studentId", getFeesByStd);


export default router;


