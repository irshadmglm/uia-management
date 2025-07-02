import express from "express";
import { addMarkList, allowEditAccess, editAceesRequst, getCountToApproveByBatch, getCountToApproveByStd, getMarkList, updateStatus } from "../controllers/marksComtroller.js";


const router = express.Router();

router.get("/count", getCountToApproveByBatch)

router.get("/count/:batchId", getCountToApproveByStd)

router.post('/', addMarkList);

router.get('/', getMarkList);

router.patch('/:marklistId/status', updateStatus);

router.patch('/:marklistId/request-edit', editAceesRequst);

router.patch('/:marklistId/allow-edit', allowEditAccess);




export default router;