import express from "express";
import { borrowBook, borrowedBooks, returnBook } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/borrow", borrowBook);

router.post("/return", returnBook);

router.get("/borrowed", borrowedBooks);

export default router;

