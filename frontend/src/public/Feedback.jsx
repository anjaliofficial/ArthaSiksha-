import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logoWhite.png";
import "./Feedback.css";

const UserFeedback = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General");
  const [success, setSuccess] = useState(false);

  const [feedbackList, setFeedbackList] = useState([
    { category: "General", message: "Great platform!", date: "2025-08-31" },
    {
      category: "Bug",
      message: "Minor UI glitch on profile page.",
      date: "2025-08-29",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      category,
      message,
      date: new Date().toISOString().split("T")[0],
    };
    setFeedbackList([newFeedback, ...feedbackList]);
    setSuccess(true);
    setMessage("");
    setTimeout(() => setSuccess(false), 3000); // hide success after 3s
  };

  return (
    <div className="feedback-page">
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
            <Link to="/learn">Learn</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
        </ul>
      </nav>

      {/* Feedback Form */}
      <div className="feedback-container">
        <h2>💬 Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>General</option>
            <option>Bug</option>
            <option>Feature Request</option>
          </select>

          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            required
          ></textarea>

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
        </form>

        {success && (
          <p className="success-msg">✅ Feedback submitted successfully!</p>
        )}

        {/* Past Feedbacks */}
        <div className="past-feedbacks">
          <h3>📝 Your Previous Feedbacks</h3>
          {feedbackList.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            <div className="feedback-list">
              {feedbackList.map((fb, idx) => (
                <div key={idx} className="feedback-card">
                  <span className="fb-category">{fb.category}</span>
                  <p className="fb-message">{fb.message}</p>
                  <span className="fb-date">{fb.date}</span>
                </div>
              ))}
            </div>
          )}
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

export default UserFeedback;
