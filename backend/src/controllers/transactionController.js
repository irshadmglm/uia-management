import Book from "../models/book.model.js";
import User from "../models/student.model.js";
import Transaction from "../models/transaction.model.js";

export const borrowBook = async (req, res) => {
  try {
    const { bookNumber, studentId } = req.body;

    const book = await Book.findOne({ bookNumber });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.status !== "available") {
      return res.status(400).json({ success: false, message: "Book is not available for borrowing" });
    }

    const student = await User.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not registered" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    book.status = "borrowed";
    book.borrowedBy = studentId;
    book.studentName = student.studentName;
    book.dueDate = dueDate;

    await book.save(); 

    const transaction = new Transaction({
      bookId: book._id,
      bookNumber: book.bookNumber,
      borrowDate: new Date(),
      dueDate: dueDate,
      studentId: studentId,
      returned: false,
    });

    await transaction.save();

    res.status(200).json({ success: true, message: "Book borrowed successfully", transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error borrowing book: ${error.message}` });
  }
};

export const returnBook = async (req, res) => {
  try {
    let { bookNumber } = req.body;

    bookNumber = parseInt(bookNumber, 10);

    const book = await Book.findOne({ bookNumber });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.status === "available") {
      return res.status(400).json({ success: false, message: "This book is already available in the library" });
    }

    book.status = "available";
    book.borrowedBy = null;
    book.studentName = null;
    book.dueDate = null;

    await book.save(); 

    const transaction = await Transaction.findOneAndUpdate(
      { bookNumber: bookNumber, returned: false },
      { $set: { returned: true, returnDate: new Date() } },
      { new: true }
    );

    if (!transaction) {
      return res.status(400).json({ success: false, message: "No active borrow record found for this book" });
    }

    res.status(200).json({ success: true, message: "Book returned successfully", transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error while returning book: ${error.message}` });
  }
};

export const borrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Transaction.aggregate([
      {
        $match: {
          returned: false, 
        },
      },
      {
        $lookup: {
          from: "users", 
          localField: "studentId",
          foreignField: "studentId", 
          as: "userInfo",
        },
      },
      {
        $lookup: {
          from: "books", 
          localField: "bookId", 
          foreignField: "_id", 
          as: "bookInfo", 
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $unwind: {
          path: "$bookInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          studentName: "$userInfo.studentName",
          studentId: "$userInfo.studentId",
          bookTitle: "$bookInfo.title",
          bookNumber: 1,
          borrowDate: 1,
          dueDate: 1,
        },
      },
      { $sort: { borrowDate: -1 } },
    ]);

    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.status(404).json({ success: false, message: "No borrowed books found" });
    }

    res.status(200).json({ success: true, borrowedBooks });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error fetching borrowed books: ${error.message}` });
  }
};

