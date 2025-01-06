const { saveBase64File } = require("../config/saveBase64File");
const bookModel = require("../models/bookModel");

// Add a new book
const addNewBook = async (req, res) => {
  const { name, image, pdfFile } = req.body;

  if (!name || !image || !pdfFile) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save files to disk
    const coverImagePath = saveBase64File(image, "uploads", "bookimages");
    const pdfFilePath = saveBase64File(pdfFile, "uploads", "bookpdfs");

    // Save book details to database
    const bookId = await bookModel.addBook({
      name,
      coverImagePath,
      pdfFilePath,
    });

    res.status(201).json({ message: "Book added successfully", bookId });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

const getBooksCount = async (req, res) => {
  try {
    const count = await bookModel.getBooksCount(); // Call the newly added function
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching books count:", error);
    res.status(500).json({ error: "Failed to fetch books count." });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid book ID" });
  }

  try {
    const book = await bookModel.getBookById(id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Delete book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await bookModel.deleteBookById(id);

    if (rowsDeleted > 0) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

module.exports = {
  addNewBook,
  getAllBooks,
  getBookById,
  deleteBook,
  getBooksCount,
};
