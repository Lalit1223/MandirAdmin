import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormStyles.css"; // Keeping the same styles for all forms

// List of zodiac signs with English names only for API request
const zodiacSigns = [
  { display: "Aries (मेष)", value: "aries" },
  { display: "Taurus (वृषभ)", value: "taurus" },
  { display: "Gemini (मिथुन)", value: "gemini" },
  { display: "Cancer (कर्क)", value: "cancer" },
  { display: "Leo (सिंह)", value: "leo" },
  { display: "Virgo (कन्या)", value: "virgo" },
  { display: "Libra (तुला)", value: "libra" },
  { display: "Scorpio (वृश्चिक)", value: "scorpio" },
  { display: "Sagittarius (धनु)", value: "sagittarius" },
  { display: "Capricorn (मकर)", value: "capricorn" },
  { display: "Aquarius (कुंभ)", value: "aquarius" },
  { display: "Pisces (मीन)", value: "pisces" },
];

const Horoscope = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [horoscopes, setHoroscopes] = useState(
    zodiacSigns.reduce((acc, sign) => ({ ...acc, [sign.value]: "" }), {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleChange = (e, signValue) => {
    setHoroscopes({ ...horoscopes, [signValue]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Get auth token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/horoscope/add`,
        horoscopes,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Horoscopes added successfully!");

        // Reset form fields
        setHoroscopes(
          zodiacSigns.reduce((acc, sign) => ({ ...acc, [sign.value]: "" }), {})
        );
      } else {
        throw new Error(response.data.message || "Failed to add horoscopes");
      }
    } catch (error) {
      console.error("Error adding horoscope:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to add the horoscope"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add Daily Horoscope</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {zodiacSigns.map((sign) => (
          <div key={sign.value} className="form-group">
            <label htmlFor={sign.value}>
              {sign.display} <span className="required">*</span>
            </label>
            <textarea
              id={sign.value}
              value={horoscopes[sign.value]}
              onChange={(e) => handleChange(e, sign.value)}
              placeholder={`Enter today's horoscope for ${sign.display}`}
              required
              disabled={loading}
            />
          </div>
        ))}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding Horoscopes...
            </span>
          ) : (
            "Add Horoscope"
          )}
        </button>
      </form>
    </div>
  );
};

export default Horoscope;
