import React, { useState } from "react";
import axios from "axios";
import BookList from "../LIst/BookList";
import "./FormStyles.css";

const Book = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setPdfFile(null);
    setIsSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image || !pdfFile) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const imageBase64 = await fileToBase64(image);
      const pdfBase64 = await fileToBase64(pdfFile);

      const formData = {
        name,
        image: imageBase64,
        pdfFile: pdfBase64,
      };

      const response = await axios.post(`${API_URL}/api/books`, formData);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      alert("Book added successfully");
      resetForm();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      alert(`Error: ${message}`);
      console.error("Full error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) return <BookList />;

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Add New Book</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Book Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter book name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Cover Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pdfFile" className="form-label">
            Upload Book PDF <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            id="pdfFile"
            onChange={(e) => setPdfFile(e.target.files[0])}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default Book;
