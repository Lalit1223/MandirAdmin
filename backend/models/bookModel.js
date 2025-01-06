const db = require("../config/db");

// Add a new book
const addBook = async ({ name, coverImagePath, pdfFilePath }) => {
  const [result] = await db.query(
    "INSERT INTO books (name, coverImagePath, pdfFilePath) VALUES (?, ?, ?)",
    [name, coverImagePath, pdfFilePath]
  );
  return result.insertId;
};

// Get all books
const getAllBooks = async () => {
  const [rows] = await db.query("SELECT * FROM books");
  return rows;
};

// Get a book by ID
const getBookById = async (id) => {
  const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0];
};

// Delete a book by ID
const deleteBookById = async (id) => {
  const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
  return result.affectedRows;
};
const getBooksCount = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM books");
  return rows[0].count;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  deleteBookById,
  getBooksCount,
};
