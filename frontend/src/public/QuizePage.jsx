import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../assets/logoWhite.png";
import "./QuizPage.css";

const quizData = {
  1: {
    title: "Budgeting Basics Quiz",
    questions: [
      {
        q: "What is the first step in budgeting?",
        options: [
          "Track expenses",
          "Invest in stocks",
          "Apply for loan",
          "Ignore bills",
        ],
        answer: "Track expenses",
      },
      {
        q: "Which is essential to save monthly?",
        options: [
          "Set a goal",
          "Buy new gadgets",
          "Eat out daily",
          "Ignore savings",
        ],
        answer: "Set a goal",
      },
      {
        q: "Needs vs Wants helps in?",
        options: [
          "Spending wisely",
          "Borrowing money",
          "Late payment",
          "Ignoring bills",
        ],
        answer: "Spending wisely",
      },
    ],
  },
  2: {
    title: "Savings & Investment Quiz",
    questions: [
      {
        q: "SIP stands for?",
        options: [
          "Systematic Investment Plan",
          "Simple Investment Policy",
          "Save In Pocket",
          "Stock Info Plan",
        ],
        answer: "Systematic Investment Plan",
      },
      {
        q: "Diversifying portfolio reduces?",
        options: ["Risk", "Profit", "Expenses", "Income"],
        answer: "Risk",
      },
    ],
  },
};

const QuizPage = () => {
  const { moduleId } = useParams();
  const quiz = quizData[moduleId];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (e, idx) => {
    setAnswers({ ...answers, [idx]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let s = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  return (
    <div className="quiz-page">
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

      {/* Quiz Content */}
      <div className="quiz-container">
        <h2>📝 {quiz.title}</h2>
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="quiz-question">
              <p>
                {idx + 1}. {q.q}
              </p>
              {q.options.map((opt, i) => (
                <label key={i} className="quiz-option">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={(e) => handleChange(e, idx)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          {!submitted && (
            <button type="submit" className="submit-btn">
              Submit Answers
            </button>
          )}
        </form>

        {submitted && (
          <div className="quiz-result">
            <h3>
              ✅ Your Score: {score} / {quiz.questions.length}
            </h3>
            <Link to="/learn" className="back-learn-btn">
              Back to Modules
            </Link>
          </div>
        )}
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

export default QuizPage;
