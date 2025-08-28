import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle, FaEnvelopeOpenText } from "react-icons/fa";
import logo from "../assets/logoWhite.png";
import "./Notifications.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Your profile was updated successfully.",
      time: "2h ago",
      read: false,
    },
    { id: 2, text: "New message from Admin.", time: "5h ago", read: true },
    {
      id: 3,
      text: "Reminder: Complete your course quiz.",
      time: "1d ago",
      read: false,
    },
    { id: 4, text: "Weekly digest is available.", time: "2d ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="notification-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/notification">Notifications</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
        <div className="nav-icons">
          <div className="notification-bell">
            <FaBell className="notification-icon" size={22} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
          <Link to="/profile">
            <FaUserCircle className="profile-icon" size={22} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-card">
          <h1>Notifications</h1>
          <p>Stay updated with your latest alerts and messages</p>
          <button className="mark-read-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>
      </section>

      {/* Notifications List */}
      <section className="notifications">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-card ${note.read ? "read" : "unread"}`}
          >
            <div className="icon-section">
              <FaEnvelopeOpenText size={20} className="note-icon" />
            </div>
            <div className="text-section">
              <p>{note.text}</p>
              <span>{note.time}</span>
            </div>
          </div>
        ))}
      </section>

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
              <li>Profile</li>
              <li>Courses</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Subscribe</h4>
            <input type="email" placeholder="Your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 Artha Shiksha. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Notification;
