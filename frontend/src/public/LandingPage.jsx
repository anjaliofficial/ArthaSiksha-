import React from "react";
import logoWhite from "../assets/logoWhite.png"; // Add your logo image

import "./LandingPage.css";

import {
  FaGamepad,
  FaClock,
  FaCertificate,
  FaMoneyBillWave,
  FaGlobe,
  FaMobileAlt,
  FaRobot,
  FaUsers,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logoWhite} alt="Artha Shiksha Logo" className="logo-img" />
        </div>{" "}
        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Learn</li>
          <li>Gamification</li>
          <li>Testimonials</li>
          <li>FAQ</li>
          <li>
            <button className="join-btn">Join Free</button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>अर्थशिक्षा (Artha Shiksha)</h1>
          <p>
            नेपाली: "सधैं वित्तीय रमाइलो तरिकाले सिक्नुहोस्"
            <br />
            English: "Learn Finance the Fun Way"
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Start Learning Free</button>
            <button className="secondary-btn">Explore Features</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaGamepad size={40} />
            <p>Gamified Learning</p>
          </div>
          <div className="feature-card">
            <FaClock size={40} />
            <p>Micro Lessons</p>
          </div>
          <div className="feature-card">
            <FaCertificate size={40} />
            <p>Certificates</p>
          </div>
          <div className="feature-card">
            <FaMoneyBillWave size={40} />
            <p>Local Finance</p>
          </div>
          <div className="feature-card">
            <FaGlobe size={40} />
            <p>Bilingual Learning</p>
          </div>
          <div className="feature-card">
            <FaMobileAlt size={40} />
            <p>Accessible Anywhere</p>
          </div>
          <div className="feature-card">
            <FaRobot size={40} />
            <p>AI Tutor</p>
          </div>
          <div className="feature-card">
            <FaUsers size={40} />
            <p>Community</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works (Step-by-Step)</h2>
        <ol>
          <li>Choose Language</li>
          <li>Pick a Lesson</li>
          <li>Play & Learn</li>
          <li>Earn Points & Certificates</li>
        </ol>
      </section>

      {/* Gamification Highlight */}
      <section className="gamification">
        <h2>Gamification Highlight</h2>
        <div className="gamification-grid">
          <div>Streaks</div>
          <div>Leaderboards</div>
          <div>Points</div>
          <div>Avatars & Badges</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-card">
          <p>"Finally understood how to save pocket money."</p>
          <span>- Aasav Sharma</span>
        </div>
        <div className="testimonial-card">
          <p>"I love the quizzes — it feels like a game, not study."</p>
          <span>- Priya Thapa</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>FAQ Section</h2>
        <div className="faq-item">
          <p>Is it free?</p>
          <p>Yes, Artha Shiksha is completely free to use.</p>
        </div>
        <div className="faq-item">
          <p>Do I get certificates?</p>
          <p>Yes, you get digital certificates after completing lessons.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>नेपाली: "आजै अर्थशिक्षा सुरु गर्नुहोस्!"</h2>
        <h3>English: "Start your finance journey today!"</h3>
        <button className="primary-btn">Join Now – Free</button>
      </section>

      {/* Footer */}
      <footer>
        <p>About | Privacy Policy | Contact | FAQ</p>
      </footer>
    </div>
  );
};

export default LandingPage;
