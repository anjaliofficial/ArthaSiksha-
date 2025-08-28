import React, { useState } from "react";
import "./EditProfile.css";
import { FaCog, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logoWhite.png"; // ✅ import same as other pages

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", { ...formData, profileImage });
    alert("Profile Updated!");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />{" "}
          {/* ✅ use imported logo */}
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/learn">Learn</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/notifications">
              <FaBell
                size={22}
                style={{ color: "#9acc38", cursor: "pointer" }}
              />
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <FaCog
                size={22}
                style={{ color: "#9acc38", cursor: "pointer" }}
              />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Edit Your Profile</h1>
          <p>Update your personal details and profile picture here.</p>
        </div>
      </section>

      {/* Profile Form */}
      <section className="settings">
        <div className="settings-grid">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-image-section">
              <img
                src={profileImage || "default-profile.png"}
                alt="Profile"
                className="profile-img"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>Empowering youth with financial literacy.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/learn">Learn</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Subscribe</h4>
            <input type="email" placeholder="Enter your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Artha Shiksha. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default EditProfile;
