import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/history", {
        event,
        date,
        description,
      });

      alert("History added successfully!");
      console.log(response.data);

      // Reset form fields
      setEvent("");
      setDate("");
      setDescription("");

      navigate("/history");
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New History Event</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="event" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className="form-control"
            id="event"
            placeholder="Enter event name"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
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
          <label htmlFor="description" className="form-label">
            Description
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
        <button type="submit" className="btn btn-primary w-100">
          Add History
        </button>
      </form>
    </div>
  );
};

export default History;
