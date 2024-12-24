import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Book = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [bookPdf, setBookPdf] = useState(null); // State for book PDF

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("publishedYear", publishedYear);
    if (coverImage) formData.append("coverImage", coverImage);
    if (bookPdf) formData.append("bookPdf", bookPdf);

    try {
      const response = await axios.post("/api/book", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Book added successfully!");
      console.log(response.data);

      // Reset form fields
      setTitle("");
      setAuthor("");
      setDescription("");
      setPublishedYear("");
      setCoverImage(null);
      setBookPdf(null);

      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter book description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="publishedYear" className="form-label">
            Published Year
          </label>
          <input
            type="number"
            className="form-control"
            id="publishedYear"
            placeholder="Enter published year"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="coverImage"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bookPdf" className="form-label">
            Upload Book PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            id="bookPdf"
            onChange={(e) => setBookPdf(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default Book;
