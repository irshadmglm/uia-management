import express from "express";
import { getRegisteredStudents, newAdmission, selected } from "../controllers/admissionController.js";

const router = express.Router();

router.post('/', newAdmission);

router.get('/', getRegisteredStudents);

router.post('/selected', selected);


export default router;
