import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormStyles.css"; // Assuming you're using the same CSS file for styling

const Horoscope = () => {
  const navigate = useNavigate();
  const [horoscopeText, setHoroscopeText] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/horoscope", { horoscopeText });

      alert("Horoscope added successfully!");
      console.log(response.data);

      // Reset form field
      setHoroscopeText("");

      navigate("/horoscope");
    } catch (error) {
      console.error("Error adding horoscope:", error);
      alert("Failed to add the horoscope. Please try again.");
    }
  };

  return (
    <div className="form-container animate__animated animate__fadeIn">
      <h2 className="form-title">Add Daily Horoscope</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="horoscopeText" className="form-label">
            Daily Horoscope <span className="required">*</span>
          </label>
          <textarea
            className="form-control"
            id="horoscopeText"
            placeholder="Enter today's horoscope"
            value={horoscopeText}
            onChange={(e) => setHoroscopeText(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Add Horoscope
        </button>
      </form>
    </div>
  );
};

export default Horoscope;
