import React, { useState } from "react";

const initialBookList = [
  { id: 1, title: "Bhagavad Gita", author: "Vyasa", pages: 700 },
  { id: 2, title: "Ramayana", author: "Valmiki", pages: 2400 },
  { id: 3, title: "Mahabharata", author: "Vyasa", pages: 7500 },
  { id: 4, title: "Upanishads", author: "Various", pages: 1080 },
  { id: 5, title: "Arthashastra", author: "Chanakya", pages: 500 },
  { id: 6, title: "Yoga Sutras", author: "Patanjali", pages: 195 },
];

const BookList = () => {
  const [books, setBooks] = useState(initialBookList); // Manage book list
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [sortAscending, setSortAscending] = useState(true); // Sort toggle
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 4; // Number of items per page

  // Delete a book by ID
  const handleDelete = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  // Sort books by ID
  const handleSort = () => {
    const sortedBooks = [...books].sort((a, b) =>
      sortAscending ? a.id - b.id : b.id - a.id
    );
    setBooks(sortedBooks);
    setSortAscending(!sortAscending);
  };

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Book List</h3>
        <div>
          <button
            className="btn btn-sm me-2"
            style={{
              backgroundColor: "#ff5722", // Primary theme color
              color: "#ffffff", // White text for contrast
            }}
            onClick={() => alert("Redirect to Add Book Modal")}
          >
            <i className="bi bi-plus-circle"></i> Add Book
          </button>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm rounded">
          <thead
            className="text-white"
            style={{
              background: "linear-gradient(135deg, #ff5722, #ecba80)",
            }}
          >
            <tr>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                ID {sortAscending ? "↑" : "↓"}
              </th>
              <th>Title</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.pages}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn  btn-sm"
          style={{
            backgroundColor: "#ff5722", // Primary theme color
            color: "#ffffff", // White text for contrast
          }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn  btn-sm"
          style={{
            backgroundColor: "#ff5722", // Primary theme color
            color: "#ffffff", // White text for contrast
          }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
