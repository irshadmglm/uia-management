import express from "express";
import { borrowBook, borrowedBooks, returnBook } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/borrow", borrowBook);

router.post("/return", returnBook);

router.get("/borrowed", borrowedBooks);

export default router;


// router.get('/borrow', transactionController.borrowForm);

// router.post('/borrow', transactionController.borrow);

// router.get('/borrowed-books', transactionController.borrowedBooks);

// router.post('/return', transactionController.returnBook)



// // // Borrow a book
// router.post('/borrowh', async (req, res) => {
//   const { userId, bookId } = req.body;
// console.log(userId, bookId );

//   const book = await Book.findById(bookId);
//   const user = await User.findById(userId);

//   if (book.status !== 'available') {
//     return res.status(400).json({ message: 'Book is not available.' });
//   }

//   book.status = 'borrowed';
//   book.borrowedBy = userId;
//   book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
//   await book.save();

//   user.borrowedBooks.push({
//     bookId,
//     borrowDate: new Date(),
//     dueDate: book.dueDate
//   });
//   await user.save();

//   res.json({ message: 'Book borrowed successfully.', book, user });
// });

// // Return a book
// router.post('/return', async (req, res) => {
//   const { userId, bookId } = req.body;

//   const book = await Book.findById(bookId);
//   const user = await User.findById(userId);

//   if (book.status !== 'borrowed' || book.borrowedBy.toString() !== userId) {
//     return res.status(400).json({ message: 'Invalid return request.' });
//   }

//   book.status = 'available';
//   book.borrowedBy = null;
//   book.dueDate = null;
//   await book.save();

//   user.borrowedBooks = user.borrowedBooks.filter(b => b.bookId.toString() !== bookId);
//   await user.save();

//   res.json({ message: 'Book returned successfully.', book, user });
// });


