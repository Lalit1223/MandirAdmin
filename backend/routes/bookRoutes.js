const express = require("express");
const {
  addNewBook,
  getAllBooks,
  getBookById,
  deleteBook,
  getBooksCount,
} = require("../controllers/bookController");

const router = express.Router();

// Add a new book
router.post("/", addNewBook);

router.get("/count", getBooksCount);

// Get all books
router.get("/", getAllBooks);

// Get a book by ID
router.get("/:id", getBookById);

// Delete a book by ID
router.delete("/:id", deleteBook);

module.exports = router;
