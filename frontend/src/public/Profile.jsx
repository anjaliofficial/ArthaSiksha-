import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoWhite from "../assets/logoWhite.png";
import {
  FaUserCircle,
  FaBell,
  FaCog,
  FaCertificate,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import "./Profile.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Profile state
  const [avatar, setAvatar] = useState("👩‍💻");
  const [username, setUsername] = useState("AnjaliBista");
  const [language, setLanguage] = useState("English");
  const points = 1200;
  const [animatedPoints, setAnimatedPoints] = useState(0);

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
        <div className="logo">
          <img src={logoWhite} alt="Artha Shiksha Logo" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/landingpage")}>Home</li>
          <li onClick={() => navigate("/features")}>Features</li>
          <li onClick={() => navigate("/learn")}>Learn</li>
          <li onClick={() => navigate("/gamification")}>Gamification</li>
          <li onClick={() => navigate("/settings")}>
            <FaCog size={20} /> Settings
          </li>
          <li>
            <FaUserCircle
              size={24}
              className="profile-icon"
              onClick={() => navigate("/profile")}
            />
          </li>
          <li>
            <FaBell
              size={20}
              className="notification-icon"
              onClick={() => navigate("/notifications")}
            />
          </li>
        </ul>
      </nav>

      {/* Profile Hero */}
      <section className="profile-hero dashboard-card">
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
          <p>Email: user@example.com</p>
          <div className="language-select">
            Language:
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

      {/* Dashboard Grid */}
      <section className="dashboard-grid">
        {/* Progress Overview */}
        <div className="dashboard-card progress-overview">
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
        <div className="dashboard-card achievements">
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
              <li onClick={() => navigate("/landingpage")}>Home</li>
              <li onClick={() => navigate("/features")}>Features</li>
              <li onClick={() => navigate("/learn")}>Learn</li>
              <li onClick={() => navigate("/gamification")}>Gamification</li>
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
            <button>Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 Artha Shiksha. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
