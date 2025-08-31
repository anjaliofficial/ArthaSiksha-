import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Quiz.css";

const quizData = {
  1: [
    {
      question: "What is the first step in budgeting?",
      options: ["Track expenses", "Invest in stocks", "Take a loan"],
      answer: 0,
    },
    {
      question: "Which is considered a fixed expense?",
      options: ["Rent", "Food", "Entertainment"],
      answer: 0,
    },
  ],
  2: [
    {
      question: "What is SIP in investments?",
      options: [
        "Systematic Investment Plan",
        "Single Investment Plan",
        "Safe Investment Program",
      ],
      answer: 0,
    },
  ],
  3: [
    {
      question: "What affects your credit score?",
      options: ["Payment history", "Favorite color", "Daily steps"],
      answer: 0,
    },
  ],
};

const QuizPage = () => {
  const { moduleId } = useParams();
  const questions = quizData[moduleId] || [];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (index) => {
    if (index === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setShowScore(true);
  };

  return (
    <div className="quiz-page">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/modules">Modules</Link>
      </nav>

      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h2>🎉 Quiz Completed!</h2>
            <p>
              Your Score: {score} / {questions.length}
            </p>
            <Link to="/modules" className="back-btn">
              Back to Modules
            </Link>
          </div>
        ) : (
          <div className="question-section">
            <h3>
              Q{current + 1}. {questions[current].question}
            </h3>
            <div className="options-list">
              {questions[current].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(idx)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
