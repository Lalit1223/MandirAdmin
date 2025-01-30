import React, { useState } from "react";
import axios from "axios";
import "./FormStyles.css"; // Common form styling

const Avatar = () => {
  const [image, setImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

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

    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    let imageBase64 = null;

    // Convert image to base64
    try {
      imageBase64 = await fileToBase64(image);
    } catch (err) {
      console.error("Error converting image to base64:", err);
      return;
    }

    // Prepare the payload
    const payload = {
      image: imageBase64,
    };

    try {
      const response = await axios.post(`${API_URL}/api/avatar`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Avatar image uploaded successfully!");

      // Reset form fields
      setImage(null);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error uploading Avatar image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  if (isSubmitted) {
    return <h4 className="text-center">Avatar image uploaded successfully!</h4>;
  }

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Upload Avatar Image</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Select Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default Avatar;
