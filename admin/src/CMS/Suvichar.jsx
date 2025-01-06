import React, { useState } from "react";
import axios from "axios";

const Suvichar = () => {
  const [image, setImage] = useState(null);
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
      const response = await axios.post(
        "http://localhost:3000/api/suvichar",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Suvichar image uploaded successfully!");

      // Reset form fields
      setImage(null);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error uploading suvichar image:", error);
      alert("Failed to upload the image. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <h4 className="text-center">Suvichar image uploaded successfully!</h4>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload Suvichar Image</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Select Image
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
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default Suvichar;
