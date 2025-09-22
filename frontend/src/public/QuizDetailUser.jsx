import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./QuizDetailUser.css";

const QuizDetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Fetch quiz by ID
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/quizzes/GetQuizByID/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.quiz) {
          setQuiz({
            ...data.quiz,
            questions: Array.isArray(data.questions) ? data.questions : [],
          });
        } else {
          setQuiz(null);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Save selected answer
  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  // Handle next question / submit
  // Handle next question / submit
const handleNext = async () => {
  if (!quiz || !quiz.questions) return;

  const userAnswer = answers[currentQuestion];
  const question = quiz.questions[currentQuestion];
  const correctAnswer = question.correct_answer;

  // If last question, submit to backend
  if (currentQuestion === quiz.questions.length - 1) {
    // Build submission payload
    const submission = {
      quiz_id: id,
      answers: Object.entries(answers).map(([qIndex, selected]) => ({
        question_id: quiz.questions[qIndex].id,
        selected: [selected] // backend expects array
      }))
    };

    try {
      const res = await fetch("http://localhost:3000/api/quizzes/submitQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(submission)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Quiz submitted ✅\nScore: ${data.score}\nXP Earned: ${data.xp}`);
      } else {
        alert(`Error submitting quiz ❌\n${data.message || "Please try again."}`);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Something went wrong submitting quiz ❌");
    }

    navigate("/quizzes"); // back to quiz list
  } else {
    // Move to next question
    setCurrentQuestion(currentQuestion + 1);
  }
};

  if (loading) return <p className="loading">Loading quiz...</p>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0)
    return <p className="empty">Quiz not found or no questions available.</p>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-page">
      <Navbar />

      <div className="quiz-container">
        <h2>{quiz.title}</h2>
        <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>

        <h3>{question?.question_text || "No question text available"}</h3>

        <ul className="options-list">
          {question?.options?.length > 0 ? (
            question.options.map((opt, idx) => (
              <li key={idx}>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={opt}
                    checked={answers[currentQuestion] === opt}
                    onChange={() => handleAnswer(opt)}
                  />
                  {opt}
                </label>
              </li>
            ))
          ) : (
            <li>No options available for this question.</li>
          )}
        </ul>

        <div className="quiz-buttons">
          <button onClick={handleNext}>
            {currentQuestion === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
          </button>

          <button onClick={() => navigate("/quizzes")} className="back-list">
            Back to Quiz List
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizDetailUser;
