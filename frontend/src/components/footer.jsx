import React from "react";
import "./footer.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6";
import logo from '../assets/logoBlack.png';

export default function footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section (Logo & Contact) */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Artha Shiksha Logo" />
          </div>
          <p className="footer-contact">
            <FaEnvelope className="footer-icon" /> abcde@gmail.com
          </p>
          <p className="footer-contact">
            <FaPhoneAlt className="footer-icon" /> +977 946-574-8765
          </p>
        </div>

        {/* Middle Section (Links) */}
        <div className="footer-links">
          <div>
            <h4>Basic Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms and Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Lesson</a></li>
              <li><a href="#">Quizzes</a></li>
              <li><a href="#">Leaderboard</a></li>
              <li><a href="#">Upcoming Events</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section (Social Media) */}
        <div className="footer-social">
          <h4>Follow Us On</h4>
          <div className="social-icons">
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2025 Artha Siksha. All rights reserved.
      </div>
    </footer>
  );
}
