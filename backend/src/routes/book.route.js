import express from "express";
import { updateBook, deleteBook, addBook, getBooks, issueBook, returnBook, getUserHistory } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks)

router.post("/add", addBook);

router.put("/update/:bookId", updateBook); 

router.delete("/delete/:bookId", deleteBook); 

router.put("/issue/:bookId", issueBook);
router.put("/return/:bookId", returnBook);
router.get("/history/:userId", getUserHistory);

export default router;


// // Get all books
// router.get('/',bookController.getBooks );

// // Add  book form
// router.get('/add-book', bookController.addBookForm); 

// // Add a new book
// router.post('/add-book', bookController.addBook);

// // Update a book form
// router.get('/:id', bookController.updateBookForm );

// // Update a book
// router.put('/:id', bookController.updateBook );

// // Delete a book
// router.delete('/:id', bookController.deleteBook );


