import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Custom CSS for animations and religious theme

const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    navigate("/home"); // Navigate to the App.js page
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
            src="https://cdn.pixabay.com/photo/2016/07/23/16/19/symbol-1537054_1280.png" // Replace with your religious icon
            alt="Icon"
            className="img-fluid mb-2"
            style={{ width: "80px", animation: "pulse 2s infinite" }}
          />
          <h4 className="fw-bold" style={{ color: "#d32f2f" }}>
            Admin Login
          </h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
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
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100"
            style={{ transition: "all 0.3s" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
