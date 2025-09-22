import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./Settings.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [theme, setTheme] = useState("Light");
  const [loading, setLoading] = useState(true);
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "Light";
    setTheme(savedTheme);
  }, []);

  // Apply theme to body and save in localStorage
  useEffect(() => {
    document.body.className = theme.toLowerCase();
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setUser({
            username: data.username || "",
            email: data.email || "",
          });
        } else {
          console.error("Failed to fetch user profile:", data.message);
          if (res.status === 401) navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Save profile
  const handleSaveProfile = async () => {
    try {
      const payload = { username: user.username, email: user.email };
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) alert("✅ Profile updated successfully!");
      else alert(data.message || "❌ Failed to update profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Error updating profile");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";   // Redirect to login page
};

  return (
    <div className="settings-page">
      <Navbar />

      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, notifications, and theme preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Profile Info */}
        <div className="settings-card">
          <h3>Profile Information</h3>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter username"
          />
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter email"
          />
          <button className="small-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </div>

        {/* Notifications */}
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

        {/* Theme */}
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

      <Footer />
    </div>
  );
};

export default SettingsPage;
