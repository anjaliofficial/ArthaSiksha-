import React from "react";
import { Link } from "react-router-dom";
import "./Modules.css";

const modules = [
  {
    id: 1,
    title: "Budgeting Basics",
    description: "Learn how to plan your monthly budget effectively.",
    tips: [
      "Track expenses daily",
      "Set savings goal",
      "Prioritize needs vs wants",
    ],
  },
  {
    id: 2,
    title: "Savings & Investments",
    description: "Understand savings accounts, SIP, and investment options.",
    tips: ["Start small", "Diversify portfolio", "Invest regularly"],
  },
  {
    id: 3,
    title: "Loans & Credit",
    description: "Learn about loans, interest rates, and credit management.",
    tips: [
      "Check interest rates",
      "Avoid late payments",
      "Maintain credit score",
    ],
  },
];

const ModulesPage = () => {
  return (
    <div className="modules-page">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="modules-container">
        <h2>📚 Financial Literacy Modules</h2>
        <div className="modules-list">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card">
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <ul className="tips-list">
                {mod.tips.map((tip, idx) => (
                  <li key={idx}>💡 {tip}</li>
                ))}
              </ul>
              <Link to={`/quiz/${mod.id}`} className="start-quiz-btn">
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
