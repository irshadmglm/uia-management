import express from "express";
import { addMarkList, allowEditAccess, editAceesRequst, getCountToApprove, getMarkList, updateStatus } from "../controllers/marksComtroller.js";


const router = express.Router();

router.post('/', addMarkList);

router.get('/', getMarkList);

router.patch('/:marklistId/status', updateStatus);

router.patch('/:marklistId/request-edit', editAceesRequst);

router.patch('/:marklistId/allow-edit', allowEditAccess);

router.get('/countToApprove', getCountToApprove)



export default router;