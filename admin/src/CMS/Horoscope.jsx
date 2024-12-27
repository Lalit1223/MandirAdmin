import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Horoscope = () => {
  const navigate = useNavigate();

  const [horoscopeText, setHoroscopeText] = useState("");

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
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Add Daily Horoscope</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="horoscopeText" className="form-label">
            Daily Horoscope
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
          Add Horoscope
        </button>
      </form>
    </div>
  );
};

export default Horoscope;
