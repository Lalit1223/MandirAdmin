const { saveBase64File } = require("../config/saveBase64File");
const bookModel = require("../models/bookModel");

// Add a new book
const addNewBook = async (req, res) => {
  const { name, coverImage, pdfFile } = req.body;

  try {
    const coverImagePath = saveBase64File(coverImage, "uploads", "books");
    const pdfFilePath = saveBase64File(pdfFile, "uploads", "books2");

    const bookId = await bookModel.addEvent({
      name,
      coverImagePath,
      pdfFilePath,
    });

    res.status(201).json({ message: "Event added successfully", bookId });
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: "Failed to add book." });
  }
};

// Get all books
const getAllBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get book by ID
const getBookByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await getBookById(id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Delete book by ID
const deleteBookController = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await deleteBookById(id);

    if (rowsDeleted > 0) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

module.exports = {
  addNewBook,
  getAllBooksController,
  getBookByIdController,
  deleteBookController,
};
