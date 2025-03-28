import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email_id: email, // ✅ Match the backend's expected key
        password,
      });

      if (response.data?.data?.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.data.admin));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/home");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #ffe0b2, #ffccbc)",
        overflow: "hidden",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "350px",
          borderRadius: "15px",
          animation: "fadeIn 2s",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn.pixabay.com/photo/2016/07/23/16/19/symbol-1537054_1280.png"
            alt="Icon"
            className="img-fluid mb-2"
            style={{ width: "80px", animation: "pulse 2s infinite" }}
          />
          <h4 className="fw-bold" style={{ color: "#d32f2f" }}>
            Admin Login
          </h4>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100"
            style={{ transition: "all 0.3s" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
