import React, { useState, useEffect } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/books`);
      console.log("Books response:", response.data);

      if (!response.data.error) {
        const bookData = response.data.books || response.data;
        setBooks(Array.isArray(bookData) ? bookData : []);
      } else {
        console.error("Error from server:", response.data.message);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/books/${id}`);
        if (!response.data.error) {
          await fetchBooks(); // Refresh the list
          alert("Book deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete the book.");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
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
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div
            className="spinner-border"
            style={{ color: "#ff5722" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center my-4">
          <i className="bi bi-book text-muted" style={{ fontSize: "2rem" }}></i>
          <p className="text-muted mt-2">No books available</p>
        </div>
      ) : (
        <>
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
                      className={`bi bi-arrow-${
                        sortOrder === "asc" ? "up" : "down"
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
                          src={`${API_URL}${book.coverImagePath}`}
                          alt={book.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>
                      {book.pdfFilePath ? (
                        <a
                          href={`${API_URL}${book.pdfFilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-file-pdf me-1"></i>
                          View PDF
                        </a>
                      ) : (
                        <span className="text-muted">No PDF</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {books.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div className="mt-3">
                <span>
                  Showing {currentBooks.length} of {filteredBooks.length}{" "}
                  records
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
