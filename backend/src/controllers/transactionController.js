import Book from "../models/book.model.js";
import User from "../models/student.model.js";
import Transaction from "../models/transaction.model.js";

export const borrowBook = async (req, res) => {
  try {
    const { bookNumber, studentId } = req.body;

    // Find the book by bookNumber
    const book = await Book.findOne({ bookNumber });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.status !== "available") {
      return res.status(400).json({ success: false, message: "Book is not available for borrowing" });
    }

    // Find the student by studentId
    const student = await User.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not registered" });
    }

    // Calculate the due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Update book status
    book.status = "borrowed";
    book.borrowedBy = studentId;
    book.studentName = student.studentName;
    book.dueDate = dueDate;

    await book.save(); // Save the updated book details

    // Create a transaction entry
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

    bookNumber = parseInt(bookNumber, 10); // Ensure bookNumber is an integer

    // Find the book by bookNumber
    const book = await Book.findOne({ bookNumber });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.status === "available") {
      return res.status(400).json({ success: false, message: "This book is already available in the library" });
    }

    // Update book status to "available"
    book.status = "available";
    book.borrowedBy = null;
    book.studentName = null;
    book.dueDate = null;

    await book.save(); // Save the updated book details

    // Update transaction history
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
          returned: false, // Only include currently borrowed books
        },
      },
      // Lookup user information using studentId
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "studentId", // Field in Transaction collection
          foreignField: "studentId", // Field in Users collection
          as: "userInfo", // Alias for joined user data
        },
      },
      // Lookup book information using bookId
      {
        $lookup: {
          from: "books", // Collection name in MongoDB
          localField: "bookId", // Field in Transaction collection
          foreignField: "_id", // Field in Books collection
          as: "bookInfo", // Alias for joined book data
        },
      },
      // Unwind user and book arrays (since $lookup returns an array)
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true, // Keep null values if no matching user
        },
      },
      {
        $unwind: {
          path: "$bookInfo",
          preserveNullAndEmptyArrays: true, // Keep null values if no matching book
        },
      },
      // Select only required fields
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
      // Sort results by borrow date (most recent first)
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

