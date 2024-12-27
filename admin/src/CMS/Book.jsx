import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Book = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(""); // Book name
  const [image, setImage] = useState(null); // Cover image
  const [pdfFile, setPdfFile] = useState(null); // PDF file

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    if (pdfFile) formData.append("pdfFile", pdfFile);

    try {
      const response = await axios.post("/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Book added successfully!");
      console.log(response.data);

      // Reset form fields
      setName("");
      setImage(null);
      setPdfFile(null);

      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Book Name
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
        <div className="mb-3">
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
        <div className="mb-3">
          <label htmlFor="pdfFile" className="form-label">
            Upload Book PDF
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
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default Book;
