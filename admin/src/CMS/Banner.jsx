import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"; // Using the same styling

const Banner = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [banner, setBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!banner) {
      setError("Please select a banner image to upload.");
      setLoading(false);
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("banner", banner);

      const response = await axios.post(`${API_URL}/banner/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);

      if (response.data.success) {
        alert("Banner uploaded successfully!");
        setBanner(null);
        setPreviewBanner("");
        setIsSubmitted(true);
      } else {
        throw new Error(response.data.message || "Failed to upload banner");
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload the banner"
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
          <h4 className="mt-3">Banner uploaded successfully!</h4>
          <button
            className="btn-submit mt-3"
            onClick={() => {
              setIsSubmitted(false);
              setPreviewBanner("");
            }}
          >
            Upload Another Banner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Upload Banner</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="banner" className="form-label">
            Select Banner Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="banner"
            onChange={handleBannerChange}
            required
            disabled={loading}
          />
          {previewBanner && (
            <div className="image-preview mt-3 text-center">
              <img
                src={previewBanner}
                alt="Banner preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
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
            "Upload Banner"
          )}
        </button>
      </form>
    </div>
  );
};

export default Banner;
