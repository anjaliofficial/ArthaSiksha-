import React, { useState, useRef, useEffect } from "react";
import logoWhite from "../assets/logoWhite.png";
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
  FaChevronDown,
  FaChevronUp,
  FaBook,
  FaPlay,
  FaAward,
  FaUsersCog,
  FaChartLine,
  FaPiggyBank,
} from "react-icons/fa";

const faqData = [
  {
    question: "Is it free?",
    answer: "Yes, Artha Shiksha is completely free to use.",
  },
  {
    question: "Do I get certificates?",
    answer: "Yes, you get digital certificates after completing lessons.",
  },
  {
    question: "Can I learn on mobile?",
    answer: "Absolutely! Works on desktop, tablet, and mobile.",
  },
  {
    question: "Is content available in Nepali?",
    answer: "Yes, all lessons are bilingual in Nepali and English.",
  },
  {
    question: "How do I earn points?",
    answer:
      "Points are earned by completing lessons, quizzes, and maintaining streaks.",
  },
];

const testimonials = [
  {
    text: "Finally understood how to save pocket money.",
    author: "Aasav Sharma",
  },
  {
    text: "I love the quizzes — it feels like a game, not study.",
    author: "Priya Thapa",
  },
  {
    text: "The gamification keeps me motivated every day.",
    author: "Suman Koirala",
  },
  {
    text: "Easy to follow and bilingual content is very helpful.",
    author: "Anita Shrestha",
  },
];

const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // References to scroll to sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const learnRef = useRef(null);
  const gamificationRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(
      ".feature-card, .how-card, .gam-card, .testimonial-card"
    );
    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logoWhite} alt="Artha Shiksha Logo" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li onClick={() => scrollToSection(heroRef)}>Home</li>
          <li onClick={() => scrollToSection(featuresRef)}>Features</li>
          <li onClick={() => scrollToSection(learnRef)}>Learn</li>
          <li onClick={() => scrollToSection(gamificationRef)}>Gamification</li>
          <li onClick={() => scrollToSection(testimonialsRef)}>Testimonials</li>
          <li onClick={() => scrollToSection(faqRef)}>FAQ</li>
          <li>
            <button
              className="join-btn"
              onClick={() => scrollToSection(ctaRef)}
            >
              Join Free
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-text">
          <h1>अर्थशिक्षा (Artha Shiksha)</h1>
          <p>
            नेपाली: "सधैं वित्तीय रमाइलो तरिकाले सिक्नुहोस्" <br /> English:
            "Learn Finance the Fun Way"
          </p>
          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => scrollToSection(featuresRef)}
            >
              Start Learning Free
            </button>
            <button
              className="secondary-btn"
              onClick={() => scrollToSection(featuresRef)}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaGamepad size={40} />
            <h3>Gamified Learning</h3>
            <p>Interactive games and quizzes for fun financial learning.</p>
          </div>
          <div className="feature-card">
            <FaChartLine size={40} />
            <h3>Progress Tracking</h3>
            <p>Track your learning and see your improvement over time.</p>
          </div>
          <div className="feature-card">
            <FaPiggyBank size={40} />
            <h3>Finance Tools</h3>
            <p>Practical tools and tips for budgeting and saving money.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" ref={learnRef}>
        <h2>How It Works</h2>
        <div className="how-cards">
          <div className="how-card">
            <FaBook size={30} />
            <h3>Choose Language</h3>
            <p>Select your preferred language, Nepali or English.</p>
          </div>
          <div className="how-card">
            <FaPlay size={30} />
            <h3>Pick a Lesson</h3>
            <p>Choose lessons that interest you the most.</p>
          </div>
          <div className="how-card">
            <FaAward size={30} />
            <h3>Play & Learn</h3>
            <p>Interactive quizzes and games to enhance learning.</p>
          </div>
          <div className="how-card">
            <FaUsersCog size={30} />
            <h3>Earn Points & Certificates</h3>
            <p>Complete lessons, earn points, and get certified.</p>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="gamification" ref={gamificationRef}>
        <h2>Gamification Highlights</h2>
        <div className="gamification-grid">
          <div className="gam-card">
            🏆 Streaks <span>Maintain learning streaks</span>
          </div>
          <div className="gam-card">
            📊 Leaderboards <span>Track your rank vs others</span>
          </div>
          <div className="gam-card">
            💰 Points <span>Earn points for lessons & quizzes</span>
          </div>
          <div className="gam-card">
            🎖️ Avatars & Badges <span>Showcase your achievements</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" ref={testimonialsRef}>
        <h2>Testimonials</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <p>"{t.text}"</p>
              <span>- {t.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" ref={faqRef}>
        <h2>Frequently Asked Questions</h2>
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="cta" ref={ctaRef}>
        <h2>नेपाली: "आजै अर्थशिक्षा सुरु गर्नुहोस्!"</h2>
        <h3>English: "Start your finance journey today!"</h3>
        <button className="primary-btn" onClick={() => scrollToSection(ctaRef)}>
          Join Now – Free
        </button>
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
              <li onClick={() => scrollToSection(heroRef)}>Home</li>
              <li onClick={() => scrollToSection(featuresRef)}>Features</li>
              <li onClick={() => scrollToSection(learnRef)}>Learn</li>
              <li onClick={() => scrollToSection(gamificationRef)}>
                Gamification
              </li>
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

export default LandingPage;
