import Book from "../models/book.model.js";
import LibraryTransaction from "../models/libraryTransaction.model.js";

export const getBooks = async (req, res) => {
    try {
      const { page = 1, limit = 20, search = '', category = 'All', status = 'All' } = req.query;
      
      const query = {};
      
      // Search
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { title: searchRegex },
          { author: searchRegex },
        ];
        // If search is a valid number, also search by bookNumber
        if (!isNaN(search) && search.trim() !== '') {
          query.$or.push({ bookNumber: parseInt(search, 10) });
        }
      }
      
      // Filter by category
      if (category && category !== 'All') {
        query.category = category;
      }
      
      // Filter by status
      if (status === 'Available') {
        query.status = 'available';
      } else if (status === 'Borrowed') {
        query.status = { $ne: 'available' };
      }
      
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const limitVal = parseInt(limit, 10);
      
      // Run queries concurrently
      const [books, total, rawCategories] = await Promise.all([
        Book.find(query).sort({ bookNumber: 1 }).skip(skip).limit(limitVal),
        Book.countDocuments(query),
        Book.distinct('category')
      ]);
  
      res.status(200).json({ 
        success: true, 
        books,
        total,
        totalPages: Math.ceil(total / limitVal),
        categories: rawCategories.filter(Boolean) // Remove null/undefined
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

export const addBook = async (req, res) => {
    try {
    let { title, bookNumber, author, category } = req.body;

    if (!title || !bookNumber || !author) {
      return res.status(400).json({ success: false, message: "Missing required fields: title, author, or bookNumber" });
    }

    bookNumber = parseInt(bookNumber, 10);

    const existingBook = await Book.findOne({ bookNumber });
    if (existingBook) {
      return res.status(400).json({ success: false, message: "This bookNumber is already registered" });
    }

    const newBook = new Book({
      title,
      bookNumber,
      author,
      category: category || "General",
      status: "available"
    });
  
      const savedBook = await newBook.save();
  
      res.status(201).json({ 
        success: true, 
        message: "Book added successfully", 
        book: savedBook 
      });
  
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
      const { bookId } = req.params; // Get book ID from URL params
      const updateData = req.body; // Get updated fields from request body
  
      const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: true });
  
      if (!updatedBook) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
  
      res.status(200).json({ success: true, message: "Book updated successfully", book: updatedBook });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
      const { bookId } = req.params; // Get book ID from URL params
  
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
  
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, userName, userRole, dueDate } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ success: false, message: "User ID and Name are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    if (book.status === "borrowed") {
      return res.status(400).json({ success: false, message: "Book is already borrowed" });
    }

    const issueDate = new Date();

    // Update Book
    book.status = "borrowed";
    book.borrowedBy = userId;
    book.studentName = userName;
    book.issueDate = issueDate;
    book.dueDate = dueDate || null;
    await book.save();

    // Create Transaction
    const transaction = new LibraryTransaction({
      bookId: book._id,
      bookTitle: book.title,
      userId,
      userName,
      userRole,
      issueDate,
      dueDate: book.dueDate,
      status: "active"
    });
    await transaction.save();

    res.status(200).json({ success: true, message: "Book issued successfully", book, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    if (book.status === "available") {
      return res.status(400).json({ success: false, message: "Book is already available" });
    }

    // Find active transaction
    const transaction = await LibraryTransaction.findOne({ bookId: book._id, status: "active" });
    if (transaction) {
      transaction.status = "returned";
      transaction.returnDate = new Date();
      await transaction.save();
    }

    // Update Book
    book.status = "available";
    book.borrowedBy = null;
    book.studentName = null;
    book.issueDate = null;
    book.dueDate = null;
    await book.save();

    res.status(200).json({ success: true, message: "Book returned successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await LibraryTransaction.find({ userId }).sort({ issueDate: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBookHistory = async (req, res) => {
  try {
    const { bookId } = req.params;
    const history = await LibraryTransaction.find({ bookId }).sort({ issueDate: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const bulkImportBooks = async (req, res) => {
  try {
    const { books, duplicateAction = "skip" } = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ success: false, message: "No books data provided for import" });
    }

    // Clean and validate incoming books
    const validBooks = [];
    const invalidCount = 0;

    for (let i = 0; i < books.length; i++) {
      const item = books[i];
      const rawNumber = item.bookNumber ?? item.accNo ?? item.slNo;
      const parsedNumber = parseInt(rawNumber, 10);
      const title = item.title?.toString().trim();
      const author = item.author?.toString().trim() || "Unknown";
      const category = item.category?.toString().trim() || "General";
      const callNumber = item.callNumber?.toString().trim() || "";
      const publisher = item.publisher?.toString().trim() || "";
      const price = parseFloat(item.price) || 0;
      const remarks = item.remarks?.toString().trim() || "";

      if (!isNaN(parsedNumber) && title) {
        validBooks.push({
          bookNumber: parsedNumber,
          title,
          author,
          category,
          callNumber,
          publisher,
          price,
          remarks,
          status: "available"
        });
      }
    }

    if (validBooks.length === 0) {
      return res.status(400).json({ success: false, message: "No valid books found in the uploaded file" });
    }

    // Extract all book numbers in this batch
    const incomingNumbers = validBooks.map(b => b.bookNumber);
    const existingBooks = await Book.find({ bookNumber: { $in: incomingNumbers } }).select("bookNumber");
    const existingNumbersSet = new Set(existingBooks.map(b => b.bookNumber));

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    if (duplicateAction === "update") {
      // Use bulkWrite for upserts
      const bulkOps = validBooks.map(b => ({
        updateOne: {
          filter: { bookNumber: b.bookNumber },
          update: {
            $set: {
              title: b.title,
              author: b.author,
              category: b.category,
              callNumber: b.callNumber,
              publisher: b.publisher,
              price: b.price,
              remarks: b.remarks
            },
            $setOnInsert: {
              status: "available"
            }
          },
          upsert: true
        }
      }));

      const result = await Book.bulkWrite(bulkOps, { ordered: false });
      importedCount = result.upsertedCount || 0;
      updatedCount = result.modifiedCount || 0;
    } else {
      // Skip duplicates: filter out existingNumbersSet
      const uniqueNewBooksMap = new Map();
      for (const book of validBooks) {
        if (existingNumbersSet.has(book.bookNumber)) {
          skippedCount++;
        } else if (uniqueNewBooksMap.has(book.bookNumber)) {
          skippedCount++; // Duplicate within the file itself
        } else {
          uniqueNewBooksMap.set(book.bookNumber, book);
        }
      }

      const booksToInsert = Array.from(uniqueNewBooksMap.values());
      if (booksToInsert.length > 0) {
        const inserted = await Book.insertMany(booksToInsert, { ordered: false });
        importedCount = inserted.length;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Bulk import completed! ${importedCount} imported, ${updatedCount} updated, ${skippedCount} skipped.`,
      stats: {
        totalReceived: books.length,
        validProcessed: validBooks.length,
        importedCount,
        updatedCount,
        skippedCount
      }
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ success: false, message: error.message || "Bulk import failed" });
  }
};

