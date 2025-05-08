import Book from "../models/book.model.js";

export const getBooks = async (req, res) => {
    try {
      const books = await Book.find().sort({ bookNumber: 1 });
  
      if (!books || books.length === 0) {
        return res.status(404).json({ success: false, message: "No books found" });
      }
  
      res.status(200).json({ success: true, books });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

export const addBook = async (req, res) => {
    try {
      let { title, bookNumber, author } = req.body;
  
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

