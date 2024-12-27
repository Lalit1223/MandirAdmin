import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "animate.css/animate.min.css"; // For animations

const Event = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("link", link);
    if (bannerImage) formData.append("bannerImage", bannerImage);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // await axios.post("/api/events", formData); // Send the event data to backend
      alert("Event added successfully!");

      // Reset form fields
      setTitle("");
      setLocation("");
      setDate("");
      setTime("");
      setDescription("");
      setLink("");
      setBannerImage(null);

      // Navigate to the events page or wherever you need
      navigate("/event");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="container  animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="bannerImage" className="form-label">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="bannerImage"
            onChange={(e) => setBannerImage(e.target.files[0])}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Event Title
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

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Event Location
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

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Event Date
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

        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            Event Time
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

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Event Description
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="link" className="form-label">
            Event Link
          </label>
          <input
            type="url"
            className="form-control"
            id="link"
            placeholder="Enter event link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
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
          Add Event
        </button>
      </form>
    </div>
  );
};

export default Event;
