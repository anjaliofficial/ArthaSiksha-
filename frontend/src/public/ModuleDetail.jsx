// src/pages/ModuleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import "./ModuleDetail.css";

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [progressing, setProgressing] = useState(false);

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Image],
    content: "<p>Loading module...</p>",
  });

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/modules/getModuleById/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (res.ok) {
          // handle content that may be stored as JSON string or object
          const rawContent = data.module?.content;
          let contentToSet = rawContent;
          try {
            if (typeof rawContent === "string") contentToSet = JSON.parse(rawContent);
          } catch (err) {
            // content is probably HTML string or plain text
            contentToSet = rawContent;
          }
          setModule(data.module);
          // set editor content safely
          setTimeout(() => editor?.commands?.setContent(contentToSet || "<p></p>"), 0);
        } else {
          alert(data.message || "Module not found");
        }
      } catch (err) {
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/quizzes/getQuizzesByModule/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.status === 401) {
          // you can decide whether to redirect or not
          return;
        }
        const data = await res.json();
        if (res.ok) setQuizzes(data.quizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchModule();
    fetchQuizzes();
  }, [id, editor, navigate]);

  const handleMarkComplete = async () => {
    if (!window.confirm("Mark this module as complete?")) return;
    setProgressing(true);
    try {
      const res = await fetch(`http://localhost:3000/api/modules/completeModule/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Module marked complete!");
      } else {
        alert(data.message || "Failed to mark complete");
      }
    } catch (err) {
      console.error("Error marking module complete:", err);
      alert("Error marking module complete");
    } finally {
      setProgressing(false);
    }
  };

  if (loading) return <p className="loading">Loading module…</p>;
  if (!module) return <p className="empty">Module not found.</p>;

  return (
    <div className="module-detail-page">
      <header className="module-header">
        <Link to="/modules" className="back-link">← Back to modules</Link>
        <h1>{module.title}</h1>
      </header>

      <section className="module-meta">
        <p className="module-desc">{module.description}</p>
        <div className="module-actions">
          <button onClick={handleMarkComplete} disabled={progressing}>
            {progressing ? "Marking..." : "Mark as Complete"}
          </button>
        </div>
      </section>

      <section className="module-content">
        <EditorContent editor={editor} />
      </section>

      <section className="module-quizzes">
        <h2>Quizzes</h2>
        {quizzes.length === 0 ? (
          <p>No quizzes for this module yet.</p>
        ) : (
          <ul className="quiz-list">
            {quizzes.map((q) => (
              <li key={q.id}>
                <strong>{q.question}</strong>
                <div className="quiz-actions">
                  {/* adapt quiz route to your app's quiz view */}
                  <Link to={`/admin/quizzes/view/${q.id}`} className="take-quiz-btn">
                    View / Take Quiz
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ModuleDetail;
