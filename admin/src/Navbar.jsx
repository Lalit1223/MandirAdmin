import { useNavigate } from "react-router-dom"; // Import the navigation hook

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear user data (if stored in localStorage/sessionStorage)
    localStorage.removeItem("isAuthenticated"); // Assuming you store the token here
    sessionStorage.removeItem("userSession"); // Optional: clear session storage
    localStorage.removeItem("authToken"); // Assuming you store the token here

    // Redirect to login page
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ fontSize: "1.5rem" }}>
          <img
            src="https://cdn.pixabay.com/photo/2016/07/23/16/19/symbol-1537054_1280.png"
            alt="Logo"
            style={{ width: "40px", marginRight: "10px" }}
          />
          Mandir Management
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn  me-4"
                style={{ backgroundColor: "#ff5722", color: "#fff" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
