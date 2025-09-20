import express from "express";
import { assignFeesToBatch, createFee, getDashboardAnalytics, getFeeByStudent, getFeesByBatch, getFeesByStd, updateFeeStatus } from "../controllers/feesController.js";

const router = express.Router();

router.put("/:cicNumber", updateFeeStatus );

router.post("/", createFee);

router.get("/", getFeesByBatch);

router.get('/dashboard', getDashboardAnalytics);

router.get('/std', getFeeByStudent)

router.post("/assign", assignFeesToBatch); 

router.get("/get-std-fees/:studentId", getFeesByStd);

export default router;


