import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"; // Common form styling

const Avatar = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!image) {
      setError("Please select an image to upload.");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Please enter a name for the avatar.");
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
      formData.append("avatar", image);
      formData.append("name", name);

      const response = await axios.post(`${API_URL}/avatar/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        alert("Avatar image uploaded successfully!");
        setImage(null);
        setName("");
        setPreviewImage("");
        setIsSubmitted(true);
      } else {
        throw new Error(response.data.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar image:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload the avatar"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="form-container animate__animated animate__fadeIn">
        <div className="text-center">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="mt-3">Avatar image uploaded successfully!</h4>
          <button
            className="btn-submit mt-3"
            onClick={() => {
              setIsSubmitted(false);
              setPreviewImage("");
            }}
          >
            Upload Another Avatar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Upload Avatar Image</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Avatar Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for this avatar"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Select Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="image"
            onChange={handleImageChange}
            required
            disabled={loading}
          />
          {previewImage && (
            <div className="image-preview mt-3 text-center">
              <img
                src={previewImage}
                alt="Avatar preview"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  padding: "5px",
                }}
              />
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
              Uploading...
            </span>
          ) : (
            "Upload Avatar"
          )}
        </button>
      </form>
    </div>
  );
};

export default Avatar;
