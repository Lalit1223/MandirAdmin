import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "animate.css/animate.min.css"; // For animations

const Mandir = () => {
  const navigate = useNavigate();

  const [mandirName, setMandirName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [mandirImage, setMandirImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("mandirName", mandirName);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("establishedYear", establishedYear);
    if (mandirImage) formData.append("mandirImage", mandirImage);

    // Debugging: Log FormData to console
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // Replace the following with your actual backend API endpoint
      //   const response = await axios.post("/api/mandir", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });

      alert("Mandir added successfully!");

      // Reset form fields
      setMandirName("");
      setLocation("");
      setDescription("");
      setEstablishedYear("");
      setMandirImage(null);

      // Navigate to the mandir list page
      navigate("/mandir");
    } catch (error) {
      console.error("Error adding mandir:", error); // No use of undefined response here
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">Add New Mandir</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="mandirName" className="form-label">
            Mandir Name
          </label>
          <input
            type="text"
            className="form-control"
            id="mandirName"
            placeholder="Enter mandir name"
            value={mandirName}
            onChange={(e) => setMandirName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter mandir description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="establishedYear" className="form-label">
            Established Year
          </label>
          <input
            type="number"
            className="form-control"
            id="establishedYear"
            placeholder="Enter established year"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mandirImage" className="form-label">
            Mandir Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="mandirImage"
            onChange={(e) => setMandirImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Mandir
        </button>
      </form>
    </div>
  );
};

export default Mandir;
