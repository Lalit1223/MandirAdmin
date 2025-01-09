import React, { useState, useEffect } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]); // Dynamic book list
  const [searchTerm, setSearchTerm] = useState(""); // Search functionality
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 10; // Number of items per page

  // Fetch books from the database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/books");
        console.log(response.data); // Debugging line

        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to fetch books from the server.");
      }
    };

    fetchBooks();
  }, []);

  // Delete a book by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this BOOK?")) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
        alert("Book deleted successfully!");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book.");
      }
    }
  };

  // Sort books by ID
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedList = [...books].sort((a, b) =>
      newSortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setBooks(sortedList);
    setSortOrder(newSortOrder);
  };

  // Filter books based on search term
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Book List</h3>
        <div>
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
                ID{" "}
                <i
                  className={`bi ${
                    sortOrder === "asc" ? "bi-arrow-up" : "bi-arrow-down"
                  }`}
                ></i>
              </th>
              <th>Title</th>
              <th>Cover Image</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.id}>
                <td className="fw-bold">{book.id}</td>
                <td>{book.name}</td>
                <td>
                  {book.coverImagePath ? (
                    <img
                      src={`http://localhost:3000${book.coverImagePath}`}
                      alt={book.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {book.pdfFilePath ? (
                    <a
                      href={`http://localhost:3000${book.pdfFilePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  ) : (
                    "No PDF"
                  )}
                </td>
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
          className="btn btn-sm"
          style={{
            backgroundColor: "#ff5722",
            color: "#ffffff",
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
          className="btn btn-sm"
          style={{
            backgroundColor: "#ff5722",
            color: "#ffffff",
          }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="mt-3  ">
        <span>
          Showing {currentBooks.length} of {filteredBooks.length} records
        </span>
      </div>
    </div>
  );
};

export default BookList;
