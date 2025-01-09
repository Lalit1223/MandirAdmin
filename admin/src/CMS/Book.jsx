import React, { useState } from "react";
import axios from "axios";
import BookList from "../LIst/BookList";
import "./FormStyles.css"; // Common form styling

const Book = () => {
  const [name, setName] = useState(""); // Book name
  const [image, setImage] = useState(null); // Cover image
  const [pdfFile, setPdfFile] = useState(null); // PDF file
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBase64 = null;
    let pdfBase64 = null;

    // Convert image and PDF to base64
    if (image) {
      try {
        imageBase64 = await fileToBase64(image);
      } catch (err) {
        console.error("Error converting image to base64:", err);
        return;
      }
    }

    if (pdfFile) {
      try {
        pdfBase64 = await fileToBase64(pdfFile);
      } catch (err) {
        console.error("Error converting PDF to base64:", err);
        return;
      }
    }

    // Prepare the payload
    const payload = {
      name,
      image: imageBase64,
      pdfFile: pdfBase64,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/books",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Book added successfully!");

      // Reset form fields
      setName("");
      setImage(null);
      setPdfFile(null);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  if (isSubmitted) {
    return <BookList />;
  }

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
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
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
          />
        </div>

        <button type="submit" className="btn-submit">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default Book;
