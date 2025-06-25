import express from "express";
import { addRecord, deleteRecord, editRecord, getRecords } from "../controllers/recordController.js";

const router = express.Router();

router.post('/', addRecord);

router.get('/', getRecords);

router.put('/:id', editRecord);

router.delete('/:id', deleteRecord);

export default router;

