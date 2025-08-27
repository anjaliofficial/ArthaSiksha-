// components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import logoWhite from "../assets/logoWhite.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logoWhite} alt="Artha Shiksha Logo" className="logo-img" />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/homepage">Home</Link>
        </li>
        <li>
          <Link to="/features">Features</Link>
        </li>
        <li>
          <Link to="/learn">Learn</Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUserCircle size={20} /> Profile
          </Link>
        </li>
        <li>
          <FaBell
            size={20}
            className="notification-icon"
            onClick={() => navigate("/notifications")}
          />
        </li>
      </ul>
      <button className="join-btn" onClick={() => navigate("/login")}>
        Join Free
      </button>
    </nav>
  );
};

export default Navbar;
