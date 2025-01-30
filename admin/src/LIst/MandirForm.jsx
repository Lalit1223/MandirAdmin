import React, { useState, useEffect } from "react";
import "../CMS/formStyles.css"; // Import the common form styling

const MandirForm = ({ mandirData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    nickname: "",
    description: "",
    youtube_live_link: "",
    offline_video_morning: "",
    offline_video_evening: "",
    offline_video_night: "",
    aarti_time_morning: "",
    aarti_time_evening: "",
    aarti_time_night: "",
    map_link: "",
    status: 0,
  });

  const [images, setImages] = useState([]); // Manage images separately

  useEffect(() => {
    if (mandirData) {
      setFormData({
        ...mandirData,
        images: undefined, // Exclude images from formData; handled separately
      });
      setImages(mandirData.images || []); // Preload existing images
    }
  }, [mandirData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]); // Append new images
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Merge images with other form data
    const submittedData = {
      ...formData,
      images: images, // Include existing and new images
    };

    onSubmit(submittedData); // Call parent handler
    {
      mandirData
        ? alert("Mandir Updated Succesfully")
        : alert("Mandir Added Succesfully");
    }
  };

  const baseUrl = import.meta.env.VITE_API_URL; // For existing image URLs
  return (
    <div className="form-container">
      <h2 className="form-title">
        {mandirData ? "Update Mandir" : "Add Mandir"}
      </h2>
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
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {/* YouTube Live Link */}
        <div className="form-group">
          <label className="form-label">YouTube Live Link</label>
          <input
            type="url"
            className="form-control"
            name="youtube_live_link"
            value={formData.youtube_live_link}
            onChange={handleChange}
          />
        </div>

        {/* Offline Videos */}
        <div className="form-group">
          <label className="form-label">Offline Video - Morning</label>
          <input
            type="url"
            className="form-control"
            name="offline_video_morning"
            value={formData.offline_video_morning}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Offline Video - Evening</label>
          <input
            type="url"
            className="form-control"
            name="offline_video_evening"
            value={formData.offline_video_evening}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Offline Video - Night</label>
          <input
            type="url"
            className="form-control"
            name="offline_video_night"
            value={formData.offline_video_night}
            onChange={handleChange}
          />
        </div>

        {/* Aarti Times */}
        <div className="form-group">
          <label className="form-label">Aarti Time - Morning</label>
          <input
            type="time"
            className="form-control"
            name="aarti_time_morning"
            value={formData.aarti_time_morning}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Aarti Time - Evening</label>
          <input
            type="time"
            className="form-control"
            name="aarti_time_evening"
            value={formData.aarti_time_evening}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Aarti Time - Night</label>
          <input
            type="time"
            className="form-control"
            name="aarti_time_night"
            value={formData.aarti_time_night}
            onChange={handleChange}
          />
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
          <label className="form-label">Images</label>
          <input
            type="file"
            className="form-control"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          <small className="form-text text-muted">
            You can upload multiple images.
          </small>
          {images.length > 0 && (
            <div className="mt-3">
              <h5>Preview:</h5>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={
                    image.startsWith("data:image")
                      ? image
                      : `${baseUrl}${image}`
                  }
                  alt={`Preview ${index}`}
                  width="100"
                  style={{ marginRight: "10px" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="0">Offline</option>
            <option value="1">Live</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn-submit">
            {mandirData ? "Update Mandir" : "Add Mandir"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MandirForm;
