import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./QuizPageUser.css";

const QuizListPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (term) => {
  try {
    const res = await fetch(`http://localhost:3000/api/quizzes/search?q=${term}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.quizzes)) setQuizzes(data.quizzes);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/quizzes/getAllQuizzes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setQuizzes(data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(q =>
    (q.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="quiz-list-page">
      <Navbar />

      <div className="quiz-list-container">
        <h2>Available Quizzes</h2>

        <input
  type="text"
  placeholder="Search quizzes..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  }}
  className="quiz-search"
/>


        {loading ? (
          <p className="loading">Loading quizzes...</p>
        ) : filteredQuizzes.length === 0 ? (
          <p className="empty">No quizzes found.</p>
        ) : (
          <ul className="quiz-list">
            {filteredQuizzes.map((quiz) => (
              <li
                key={quiz.id}
                className="quiz-item"
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                <div className="quiz-title">{quiz.title || "Untitled Quiz"}</div>
                <div className="quiz-meta">
                  <span>{quiz.questions?.length || 0} Questions</span>
                  {quiz.questions?.[0]?.question_text && (
                    <span className="first-question">
                      First question: {quiz.questions[0].question_text.slice(0, 50)}...
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <button onClick={() => navigate("/homepage")} className="back-home">
          Back to Home
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default QuizListPage;
