import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell } from "react-icons/fa";
import logoWhite from "../assets/logoWhite.png"; // Replace with your actual path
import "./Settings.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("AnjaliBista");
  const [email, setEmail] = useState("user@example.com");
  const [language, setLanguage] = useState("English");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [theme, setTheme] = useState("Light");

  const handleSaveProfile = () => alert("Profile updated!");
  const handleChangePassword = () => alert("Password changed!");
  const handleLogout = () => navigate("/login");

  return (
    <div className="settings-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logoWhite} alt="Artha Shiksha Logo" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/landingpage")}>Home</li>
          <li onClick={() => navigate("/features")}>Features</li>
          <li onClick={() => navigate("/learn")}>Learn</li>
          <li onClick={() => navigate("/gamification")}>Gamification</li>
          <li onClick={() => navigate("/profile")}>
            <FaUserCircle size={20} /> Profile
          </li>
          <li onClick={() => navigate("/notifications")}>
            <FaBell size={18} />
          </li>
        </ul>
      </nav>

      {/* Header */}
      <div className="settings-header">
        <h1>Settings</h1>
        <p>
          Manage your profile, security, notifications, and theme preferences.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="settings-grid">
        {/* Profile Info */}
        <div className="settings-card">
          <h3>Profile Information</h3>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Nepali</option>
          </select>
          <button className="small-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h3>Change Password</h3>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <button className="small-btn" onClick={handleChangePassword}>
            Update Password
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="settings-card">
          <h3>Notifications</h3>
          <label>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  email: !notifications.email,
                })
              }
            />
            Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() =>
                setNotifications({ ...notifications, sms: !notifications.sms })
              }
            />
            SMS Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  push: !notifications.push,
                })
              }
            />
            Push Notifications
          </label>
          <button
            className="small-btn"
            onClick={() => alert("Notifications updated!")}
          >
            Save Notifications
          </button>
        </div>

        {/* Theme Selection */}
        <div className="settings-card">
          <h3>Theme Selection</h3>
          <div className="theme-toggle">
            <div
              className={`toggle-option ${theme === "Light" ? "active" : ""}`}
              onClick={() => setTheme("Light")}
            >
              Light
            </div>
            <div
              className={`toggle-option ${theme === "Dark" ? "active" : ""}`}
              onClick={() => setTheme("Dark")}
            >
              Dark
            </div>
            <div
              className={`toggle-indicator ${
                theme === "Dark" ? "right" : "left"
              }`}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="settings-card">
          <h3>Account</h3>
          <button className="small-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>
              Artha Shiksha is your platform for interactive financial
              education.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Features</li>
              <li>Learn</li>
              <li>Gamification</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@arthashiksha.com</p>
            <p>Phone: +977 1234 56789</p>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <input type="email" placeholder="Your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 Artha Shiksha. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SettingsPage;
