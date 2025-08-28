import React from "react";
import "./Notification.css";
import { Bell, User } from "lucide-react";

export default function Notification() {
  const notifications = [
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
  ];

  return (
    <div className="notification-page">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <ul className="nav-links">
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/notification">Notifications</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
        <div className="nav-icons">
          <Bell className="notification-icon" />
          <User className="profile-icon" />
        </div>
      </nav>

      {/* ✅ Hero */}
      <section className="hero">
        <h1>Notifications</h1>
        <p>Stay updated with the latest alerts and messages</p>
      </section>

      {/* ✅ Notifications List */}
      <section className="notifications">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-card ${note.read ? "read" : "unread"}`}
          >
            <p>{note.text}</p>
            <span>{note.time}</span>
          </div>
        ))}
      </section>

      {/* ✅ Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>Our platform helps you learn and grow every day.</p>
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
            <p>Get the latest updates in your inbox</p>
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 ArthaSikshya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
