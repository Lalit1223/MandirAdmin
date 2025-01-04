const pool = require("../config/db");

// Add a new book

const addBook = async (bookData) => {
  const query = `
    INSERT INTO books (name, cover_image, pdf_file) 
    VALUES (?, ?, ?)
  `;

  const values = [bookData.name, bookData.cover_image, bookData.pdf_file];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId; // Return the newly inserted event ID
  } catch (err) {
    throw new Error("Failed to add event");
  }
};

// Get all books
const getAllBooks = async () => {
  const query = "SELECT * FROM books";
  const [books] = await pool.query(query);
  return books;
};

// Get a book by ID
const getBookById = async (id) => {
  const query = "SELECT * FROM books WHERE id = ?";
  const [books] = await pool.query(query, [id]);
  return books[0]; // Return the first (and only) book
};

// Delete a book by ID
const deleteBookById = async (id) => {
  const query = "DELETE FROM books WHERE id = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows; // Return the number of rows affected
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  deleteBookById,
};
