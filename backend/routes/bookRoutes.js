const express = require("express");
const {
  addNewBook,
  getAllBooksController,
  getBookByIdController,
  deleteBookController,
} = require("../controllers/bookController");

const router = express.Router();

// POST route to add a new book
router.post("/", addNewBook);

// GET route to fetch all books
router.get("/", getAllBooksController);

// GET route to fetch a book by ID
router.get("/:id", getBookByIdController);

// DELETE route to remove a book by ID
router.delete("/:id", deleteBookController);

module.exports = router;
