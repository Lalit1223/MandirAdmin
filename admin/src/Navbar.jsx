import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
                className="btn btn-sm me-4"
                style={{ backgroundColor: "#ff5722", color: "#fff" }}
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
