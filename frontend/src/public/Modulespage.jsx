import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logoWhite.png";
import "./Modulespage.css";

const modules = [
  {
    id: 1,
    title: "Budgeting Basics",
    description: "Learn how to plan your monthly budget effectively.",
    tips: [
      {
        text: "Track expenses daily",
        info: "Write down everything you spend daily.",
      },
      {
        text: "Set savings goal",
        info: "Decide how much you want to save each month.",
      },
      {
        text: "Prioritize needs vs wants",
        info: "Spend first on needs, then wants.",
      },
    ],
  },
  {
    id: 2,
    title: "Savings & Investments",
    description: "Understand savings accounts, SIP, and investment options.",
    tips: [
      { text: "Start small", info: "Even small amounts grow with time." },
      {
        text: "Diversify portfolio",
        info: "Invest in multiple options to reduce risk.",
      },
      { text: "Invest regularly", info: "Set automated monthly investments." },
    ],
  },
  {
    id: 3,
    title: "Loans & Credit",
    description: "Learn about loans, interest rates, and credit management.",
    tips: [
      {
        text: "Check interest rates",
        info: "Compare rates before taking loans.",
      },
      {
        text: "Avoid late payments",
        info: "Late payments can reduce credit score.",
      },
      {
        text: "Maintain credit score",
        info: "Pay bills on time and use credit wisely.",
      },
    ],
  },
];

const infographics = [
  {
    title: "Nepal Tax Guide",
    img: "/images/tax.png",
    details: "Nepalese tax rules and filing tips.",
  },
  {
    title: "Mobile Wallet Usage",
    img: "/images/wallet.png",
    details: "Popular wallets and usage tips.",
  },
  {
    title: "Saving Habits",
    img: "/images/savings.png",
    details: "Best practices for monthly savings.",
  },
];

const dailyTips = [
  {
    text: "Save at least 20% of your income every month.",
    info: "Allocate savings before spending.",
  },
  {
    text: "Avoid unnecessary expenses on impulse shopping.",
    info: "Plan purchases in advance.",
  },
  {
    text: "Check NEPSE stock updates before investing.",
    info: "Stay informed to avoid losses.",
  },
  {
    text: "Track your monthly spending using ArthaShiksha dashboard.",
    info: "Monitor progress visually.",
  },
];

const ModulesPage = () => {
  const [modalData, setModalData] = useState(null);

  return (
    <div className="modules-page">
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
        </ul>
      </nav>

      {/* Modules List */}
      <div className="modules-container">
        <h2>📚 Financial Literacy Modules</h2>
        <div className="modules-list">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card">
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <ul className="tips-list">
                {mod.tips.map((tip, idx) => (
                  <li key={idx} title={tip.info}>
                    💡 {tip.text}
                  </li>
                ))}
              </ul>
              <Link to={`/quiz/${mod.id}`} className="start-quiz-btn">
                Start Quiz
              </Link>
            </div>
          ))}
        </div>

        {/* Infographics */}
        <div className="infographics-section">
          <h2>📊 Infographics & Visuals</h2>
          <div className="infographics-grid">
            {infographics.map((info, idx) => (
              <div
                key={idx}
                className="infographic-card"
                onClick={() => setModalData(info)}
              >
                <img src={info.img} alt={info.title} />
                <p>{info.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalData && (
          <div className="modal" onClick={() => setModalData(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{modalData.title}</h3>
              <p>{modalData.details}</p>
              <button onClick={() => setModalData(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Daily Tips */}
        <div className="daily-tips">
          <h2>📝 Daily Finance Tips</h2>
          <ul>
            {dailyTips.map((tip, idx) => (
              <li key={idx} title={tip.info}>
                {tip.text}
              </li>
            ))}
          </ul>
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

export default ModulesPage;
