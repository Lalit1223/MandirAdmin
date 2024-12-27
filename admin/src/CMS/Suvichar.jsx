import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Suvichar = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // State for image file

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("/api/suvichar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully!");
      console.log("Response:", response.data);

      // Reset form field
      setImage(null);

      navigate("/suvichar");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload Image</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Image
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
          className="btn  w-100"
          style={{
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Suvichar;
