import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCog,
  FaBell,
  FaTrophy,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";
import logo from "../assets/logoWhite.png";
import "./Profile.css";

const Profile = () => {
  const [avatar, setAvatar] = useState("👩‍💻");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    age: 25,
    occupation: "Student",
    financialGoal: "Save 1 lakh",
    language: "English",
  });

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

  const handleSaveProfile = () => {
    alert("Profile saved locally!");
  };

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/features" className="nav-link">
              Features
            </Link>
          </li>
          <li>
            <Link to="/learn" className="nav-link">
              Learn
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="nav-link">
              <FaBell size={22} />
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link">
              <FaCog size={22} />
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
          {["Name", "Email", "Age", "Occupation", "Financial Goal"].map(
            (label, idx) => {
              const key = label.toLowerCase().replace(" ", "");
              return (
                <div className="input-box" key={idx}>
                  <label>{label}</label>
                  <input
                    type={key === "age" ? "number" : "text"}
                    value={user[key]}
                    onChange={(e) =>
                      setUser({ ...user, [key]: e.target.value })
                    }
                  />
                </div>
              );
            }
          )}

          <div className="input-box">
            <label>Language</label>
            <select
              value={user.language}
              onChange={(e) => setUser({ ...user, language: e.target.value })}
            >
              <option>English</option>
              <option>Nepali</option>
            </select>
          </div>

          <p className="user-points">Points: {animatedPoints}</p>
          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>
      </section>

      {/* Dashboard */}
      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>
            <FaChartLine /> Learning Progress
          </h3>
          {["Savings Basics", "Budgeting", "Investing"].map((lesson, idx) => {
            const widths = ["90%", "75%", "50%"];
            return (
              <div className="progress-bar" key={idx}>
                <span>{lesson}</span>
                <div className="progress">
                  <div className="progress-fill" style={{ width: widths[idx] }}>
                    {widths[idx]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
              {["Home", "Features", "Learn", "Gamification"].map(
                (item, idx) => (
                  <li key={idx}>{item}</li>
                )
              )}
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
