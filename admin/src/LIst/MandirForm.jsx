import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CMS/formStyles.css"; // Import the common form styling

const MandirForm = ({ mandirData, onSubmit, isEditing }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    nick_name: "",
    description: "",
    youtubeURL: "",
    offlineURL: {
      morning: "",
      evening: "",
      night: "",
    },
    aarti_time: {
      morning: "",
      evening: "",
      night: "",
    },
    map_link: "",
    country: "",
    city: "",
    status: false,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mandirData) {
      // Map API data structure to form structure
      setFormData({
        title: mandirData.title || "",
        nick_name: mandirData.nick_name || "",
        description: mandirData.description || "",
        youtubeURL: mandirData.youtubeURL || "",
        offlineURL: mandirData.offlineURL || {
          morning: "",
          evening: "",
          night: "",
        },
        aarti_time: mandirData.aarti_time || {
          morning: "",
          evening: "",
          night: "",
        },
        map_link: mandirData.map_link || "",
        country: mandirData.country || "",
        city: mandirData.city || "",
        status: mandirData.status || false,
      });

      // Handle existing images
      if (mandirData.images && mandirData.images.length > 0) {
        setImages(mandirData.images);
      }
    }
  }, [mandirData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value === "true",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("nick_name", formData.nick_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("youtubeURL", formData.youtubeURL);
      formDataToSend.append("map_link", formData.map_link);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("status", formData.status);

      // Add nested objects as JSON strings
      formDataToSend.append("offlineURL", JSON.stringify(formData.offlineURL));
      formDataToSend.append("aarti_time", JSON.stringify(formData.aarti_time));

      // Add images if they are File objects
      if (images.length > 0) {
        // Check if images are File objects or existing image URLs
        if (typeof images[0] === "object") {
          images.forEach((image) => {
            formDataToSend.append("images", image);
          });
        }
      }

      let response;
      if (isEditing && mandirData._id) {
        // Update existing mandir using PATCH request
        response = await axios.patch(
          `${API_URL}/mandir/update/${mandirData._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        // Create new mandir
        response = await axios.post(`${API_URL}/mandir/add`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (response.data.success) {
        onSubmit();
        alert(
          isEditing
            ? "Mandir updated successfully!"
            : "Mandir added successfully!"
        );
      } else {
        setError(response.data.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isEditing ? "Update Mandir" : "Add Mandir"}
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nickname */}
        <div className="form-group">
          <label className="form-label">Nickname</label>
          <input
            type="text"
            className="form-control"
            name="nick_name"
            value={formData.nick_name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label">
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <label className="form-label">
            Country <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        {/* YouTube Live Link */}
        <div className="form-group">
          <label className="form-label">YouTube Live Link</label>
          <input
            type="url"
            className="form-control"
            name="youtubeURL"
            value={formData.youtubeURL}
            onChange={handleChange}
          />
        </div>

        {/* Offline Videos */}
        <div className="form-group">
          <label className="form-label">Offline Videos</label>
          <div className="mb-2">
            <label className="small">Morning Video URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.offlineURL.morning}
              onChange={(e) =>
                handleNestedChange("offlineURL", "morning", e.target.value)
              }
            />
          </div>
          <div className="mb-2">
            <label className="small">Evening Video URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.offlineURL.evening}
              onChange={(e) =>
                handleNestedChange("offlineURL", "evening", e.target.value)
              }
            />
          </div>
          <div>
            <label className="small">Night Video URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.offlineURL.night}
              onChange={(e) =>
                handleNestedChange("offlineURL", "night", e.target.value)
              }
            />
          </div>
        </div>

        {/* Aarti Times */}
        <div className="form-group">
          <label className="form-label">Aarti Times</label>
          <div className="mb-2">
            <label className="small">Morning Time</label>
            <input
              type="time"
              className="form-control"
              value={formData.aarti_time.morning}
              onChange={(e) =>
                handleNestedChange("aarti_time", "morning", e.target.value)
              }
            />
          </div>
          <div className="mb-2">
            <label className="small">Evening Time</label>
            <input
              type="time"
              className="form-control"
              value={formData.aarti_time.evening}
              onChange={(e) =>
                handleNestedChange("aarti_time", "evening", e.target.value)
              }
            />
          </div>
          <div>
            <label className="small">Night Time</label>
            <input
              type="time"
              className="form-control"
              value={formData.aarti_time.night}
              onChange={(e) =>
                handleNestedChange("aarti_time", "night", e.target.value)
              }
            />
          </div>
        </div>

        {/* Map Link */}
        <div className="form-group">
          <label className="form-label">Map Link</label>
          <input
            type="url"
            className="form-control"
            name="map_link"
            value={formData.map_link}
            onChange={handleChange}
          />
        </div>

        {/* Images */}
        <div className="form-group">
          <label className="form-label">
            Images {!isEditing && <span className="required">*</span>}
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required={!isEditing && images.length === 0}
          />
          <small className="form-text text-muted">
            You can upload maximum 5 images.
          </small>

          {images.length > 0 && (
            <div className="mt-3">
              <h5>Current Images:</h5>
              <div className="d-flex flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="me-2 mb-2">
                    {typeof image === "string" ? (
                      <img
                        src={`${API_URL}${image}`}
                        alt={`Mandir ${index}`}
                        width="100"
                        height="100"
                        className="object-fit-cover border rounded"
                      />
                    ) : (
                      <div className="border rounded p-2 text-center">
                        <span className="text-success">New Image</span>
                        <p
                          className="mb-0 text-truncate"
                          style={{ maxWidth: "100px" }}
                        >
                          {image.name}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status.toString()}
            onChange={handleChange}
          >
            <option value="false">Offline</option>
            <option value="true">Live</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isEditing ? "Updating..." : "Adding..."}
              </span>
            ) : isEditing ? (
              "Update Mandir"
            ) : (
              "Add Mandir"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MandirForm;
