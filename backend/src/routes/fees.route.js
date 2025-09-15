import express from "express";
import { assignFeesToBatch, createFee, getFeesByBatch, getFeesByStd, updateFeeStatus } from "../controllers/feesController.js";

const router = express.Router();

router.put("/:cicNumber", updateFeeStatus );

router.post("/", createFee);

router.get("/", getFeesByBatch);

router.post("/assign", assignFeesToBatch); 

router.get("/get-std-fees/:studentId", getFeesByStd);

export default router;


