import React, { useState, useEffect } from "react";
import "./Profile.css";
import {
  FaCog,
  FaBell,
  FaTrophy,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logoWhite.png";

const Profile = () => {
  // Avatar
  const [avatar, setAvatar] = useState("👩‍💻");

  // User info placeholders (replace with backend data)
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@email.com");
  const [age, setAge] = useState(25);
  const [occupation, setOccupation] = useState("Student");
  const [language, setLanguage] = useState("English");

  // Points
  const points = 1200;
  const [animatedPoints, setAnimatedPoints] = useState(0);

  // Badges and Certificates
  const badges = [
    { name: "Beginner Saver", emoji: "🏆" },
    { name: "Budget Master", emoji: "💰" },
    { name: "Quiz Champ", emoji: "📊" },
  ];

  const certificates = [
    "Data Quest: Python Module",
    "Finance Basics",
    "Budgeting 101",
  ];

  // Recent Activities
  const recentActivities = [
    { lesson: "Saving Basics", score: 95 },
    { lesson: "Quiz 1", score: 88 },
    { lesson: "Investing Intro", score: 92 },
    { lesson: "Budget Challenge", score: 85 },
    { lesson: "Quiz 2", score: 100 },
  ];

  // Animate points
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 10;
      if (start >= points) {
        start = points;
        clearInterval(interval);
      }
      setAnimatedPoints(start);
    }, 50);
    return () => clearInterval(interval);
  }, [points]);

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
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
              <FaBell size={22} className="notification-icon" />
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <FaCog size={22} className="profile-icon" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Hero */}
      <section className="profile-hero">
        <div className="avatar-section">
          <div className="avatar">{avatar}</div>
          <div className="avatar-options">
            <button onClick={() => setAvatar("👩‍💻")}>👩‍💻</button>
            <button onClick={() => setAvatar("🧑‍🎓")}>🧑‍🎓</button>
            <button onClick={() => setAvatar("🧑‍💼")}>🧑‍💼</button>
          </div>
        </div>
        <div className="user-info">
          <h2>{username}</h2>
          <p>Email: {email}</p>
          <p>Age: {age}</p>
          <p>Occupation: {occupation}</p>
          <div className="language-select">
            Language:{" "}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Nepali</option>
            </select>
          </div>
          <p className="user-points">Points: {animatedPoints}</p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="dashboard-grid">
        {/* Learning Progress */}
        <div className="dashboard-card">
          <h3>
            <FaChartLine /> Learning Progress
          </h3>
          <div className="progress-bar">
            <span>Savings Basics</span>
            <div className="progress">
              <div className="progress-fill" style={{ width: "90%" }}>
                90%
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <span>Budgeting</span>
            <div className="progress">
              <div className="progress-fill" style={{ width: "75%" }}>
                75%
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <span>Investing</span>
            <div className="progress">
              <div className="progress-fill" style={{ width: "50%" }}>
                50%
              </div>
            </div>
          </div>
        </div>

        {/* Badges & Certificates */}
        <div className="dashboard-card">
          <h3>
            <FaTrophy /> Badges & Certificates
          </h3>
          <div className="badge-list">
            {badges.map((b, idx) => (
              <div key={idx} className="badge-card" title={b.name}>
                {b.emoji} {b.name}
              </div>
            ))}
          </div>
          <div className="certificate-list">
            {certificates.map((c, idx) => (
              <div key={idx} className="certificate-card">
                {c}{" "}
                <button>
                  <FaCertificate /> Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card recent-activities">
          <h3>Recent Activities</h3>
          <ul>
            {recentActivities.map((act, idx) => (
              <li key={idx}>
                {act.lesson} - Score: {act.score}
              </li>
            ))}
          </ul>
        </div>
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

export default Profile;
