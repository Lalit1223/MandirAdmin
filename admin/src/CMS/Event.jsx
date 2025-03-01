import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "animate.css/animate.min.css"; // For animations
import EventList from "../LIst/EventList";
import "./FormStyles.css"; // Common form styling

const Event = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
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
      setBannerImage(file); // Save the actual file

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

    // Get auth token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("link", link);

    // Append banner image if it exists
    if (bannerImage) {
      formData.append("banner_image", bannerImage);
    }

    try {
      const response = await axios.post(`${API_URL}/event/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        alert("Event added successfully!");

        // Reset form fields
        setTitle("");
        setLocation("");
        setDate("");
        setTime("");
        setDescription("");
        setLink("");
        setBannerImage(null);
        setPreviewImage("");

        // Navigate to the events page or render another component
        setIsSubmitted(true);
      } else {
        setError(response.data.message || "Failed to add the event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to add the event. Please try again."
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
    return <EventList />;
  }

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Create New Event</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="bannerImage" className="form-label">
            Banner Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="bannerImage"
            onChange={handleImageChange}
            required
          />
          {previewImage && (
            <div className="image-preview mt-2">
              <img
                src={previewImage}
                alt="Banner preview"
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
          <label htmlFor="title" className="form-label">
            Event Title <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Event Location <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            placeholder="Enter event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Event Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time" className="form-label">
            Event Time <span className="required">*</span>
          </label>
          <input
            type="time"
            className="form-control"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Event Description <span className="required">*</span>
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link" className="form-label">
            Event Link <span className="required">*</span>
          </label>
          <input
            type="url"
            className="form-control"
            id="link"
            placeholder="Enter event link (e.g., registration page, details page)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding Event...
            </span>
          ) : (
            "Add Event"
          )}
        </button>
      </form>
    </div>
  );
};

export default Event;
