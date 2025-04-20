import express from "express";
import { createFee, getFeesByBatch } from "../controllers/feesController.js";

const router = express.Router();

router.post("/", createFee);

router.get("/", getFeesByBatch);


export default router;


