import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import "./ModulePage.css";
import logo from "../assets/logoWhite.png";

const QuizPage = () => {
  const { quizId } = useParams(); // Get quizId from URL
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  // Module Editor (read-only)
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Loading module...</p>",
    editable: false,
  });

  useEffect(() => {
    const fetchQuizAndModule = async () => {
      try {
        // 1️⃣ Fetch the quiz by ID
        const resQuiz = await fetch(
          `http://localhost:3000/api/quizzes/GetQuizByID/${quizId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const dataQuiz = await resQuiz.json();
        if (!resQuiz.ok) return alert(dataQuiz.message || "Quiz not found");

        setQuiz(dataQuiz.quiz);

        const moduleId = dataQuiz.quiz.module_id;

        // 2️⃣ Fetch the module
        const resModule = await fetch(
          `http://localhost:3000/api/modules/getModuleById/${moduleId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const dataModule = await resModule.json();
        if (!resModule.ok) return alert(dataModule.message || "Module not found");

        setModule(dataModule.module);
        editor?.commands.setContent(dataModule.module.content);

        // 3️⃣ Fetch all quizzes for this module
        const resAllQuizzes = await fetch(
          `http://localhost:3000/api/quizzes/getQuizzesByModule/${moduleId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const dataAllQuizzes = await resAllQuizzes.json();
        if (resAllQuizzes.ok) setQuizzes(dataAllQuizzes.quizzes);
      } catch (err) {
        console.error(err);
        alert("Error fetching quiz or module");
      }
    };

    fetchQuizAndModule();
  }, [quizId, editor]);

  const handleSaveQuiz = async () => {
    if (!quizQuestion || !quizAnswer) return alert("Question & Answer required");
    if (!module) return alert("Module not loaded");

    try {
      const res = await fetch("http://localhost:3000/api/quizzes/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          question: quizQuestion,
          correct_answer: quizAnswer,
          options,
          module_id: module.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Quiz created successfully!");
        setQuizzes((prev) => [...prev, data.quiz]);
        setQuizQuestion("");
        setQuizAnswer("");
        setOptions(["", "", "", ""]);
        setShowQuizForm(false);
      } else alert(data.message || "Failed to create quiz");
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    }
  };

  if (!module || !quiz) return <p className="loading">Loading quiz and module...</p>;

  return (
    <div className="module-page">
      <header className="module-header">
        <Link to="/admin">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <h2>{module.title}</h2>
      </header>

      <main className="module-content">
        <p className="module-description">{module.description}</p>
        <div className="editor-container">
          <EditorContent editor={editor} />
        </div>

        <h3>Quizzes for this Module:</h3>
        <ul className="quiz-list">
          {quizzes.map((q) => (
            <li key={q.id}>
              <strong>{q.question}</strong> (Answer: {q.correct_answer})
              {q.options?.length > 0 && (
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {quizzes.length === 0 && <p>No quizzes yet.</p>}
        </ul>

        <button
          className="createQuizBtn"
          onClick={() => setShowQuizForm((prev) => !prev)}
        >
          {showQuizForm ? "Cancel" : "Create Quiz for this Module +"}
        </button>

        {showQuizForm && (
          <div className="quiz-form">
            <label>Question</label>
            <input
              type="text"
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
            />

            <label>Correct Answer</label>
            <input
              type="text"
              value={quizAnswer}
              onChange={(e) => setQuizAnswer(e.target.value)}
            />

            <label>Options</label>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: "flex", marginBottom: "5px" }}>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[idx] = e.target.value;
                    setOptions(newOptions);
                  }}
                  style={{ flex: 1, marginRight: "5px" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setOptions((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  ❌
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setOptions([...options, ""])}>
              ➕ Add Option
            </button>

            <button className="saveQuizBtn" onClick={handleSaveQuiz}>
              Save Quiz
            </button>
          </div>
        )}
      </main>

      <footer className="module-footer">
        <p>&copy; 2025 My Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default QuizPage;
