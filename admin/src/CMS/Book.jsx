import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookList from "../LIst/BookList";
import "./FormStyles.css";

const Book = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const resetForm = () => {
    setName("");
    setCoverImage(null);
    setPdfFile(null);
    setPreviewImage("");
    setIsSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !coverImage || !pdfFile) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Get auth token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("cover_image", coverImage);
      formData.append("file", pdfFile);

      const response = await axios.post(`${API_URL}/book/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        alert("Book added successfully");
        resetForm();
      } else {
        throw new Error(response.data.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message || error.message || "Failed to add book"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (isSubmitted) return <BookList />;

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Add New Book</h2>
      {error && <div className="form-error">{error}</div>}

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
          <label htmlFor="coverImage" className="form-label">
            Cover Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="coverImage"
            onChange={handleImageChange}
            required
            disabled={loading}
          />
          {previewImage && (
            <div className="image-preview mt-2">
              <img
                src={previewImage}
                alt="Cover preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
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
            onChange={handleFileChange}
            required
            disabled={loading}
          />
          {pdfFile && (
            <div className="file-info mt-2">
              <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
              <span>{pdfFile.name}</span> ({Math.round(pdfFile.size / 1024)} KB)
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding Book...
            </span>
          ) : (
            "Add Book"
          )}
        </button>
      </form>
    </div>
  );
};

export default Book;
