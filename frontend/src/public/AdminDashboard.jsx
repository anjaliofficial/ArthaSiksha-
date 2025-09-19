import React, { useState, useEffect } from "react";
import { FaUsers, FaBook, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import "./AdminDashboard.css";
import logo from "../assets/logoWhite.png";
import Placeholder from '@tiptap/extension-placeholder';
import { useLocation } from "react-router-dom";


// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const moduleIdFromUrl = queryParams.get("moduleId");
  const [activeTab, setActiveTab] = useState("users");

  // Modules state
  const [modules, setModules] = useState([]);
  const [editModuleData, setEditModuleData] = useState(null);

  // Quizzes state
  const [quizzes, setQuizzes] = useState([]);
  const [editQuizData, setEditQuizData] = useState(null);

  // Quiz Options
  const [options, setOptions] = useState(["", "", "", ""]);


  // Articles state
  const [articles, setArticles] = useState([]);
  const [editArticleData, setEditArticleData] = useState(null);

  // Editor modal state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // modules: description, articles: tags/body

  const editor = useEditor({
    extensions: [StarterKit, Image, Placeholder.configure({ placeholder: "Start typing here..." })],
    content: "<p></p>",
    editorProps: { attributes: { class: "editor-content" } },
  });

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Fetch Modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/modules/getAllModules", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setModules(data.modules);
      } catch (err) {
        console.error(err);
      }
    };
    fetchModules();
  }, []);

  // Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/articles/getAllArticles", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setArticles(data.articles);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticles();
  }, []);

  // Fetch Quizzes
useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      let res;
      if (moduleIdFromUrl) {
        res = await fetch(`http://localhost:3000/api/quizzes/getQuizzesByModule/${moduleIdFromUrl}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        res = await fetch("http://localhost:3000/api/quizzes/getAllQuizzes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      const data = await res.json();
      if (res.ok) setQuizzes(data.quizzes);
    } catch (err) {
      console.error(err);
    }
  };

  fetchQuizzes();
}, [moduleIdFromUrl]);


  // ------------------- QUIZZES -------------------
  const handleEditQuiz = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/quizzes/GetQuizByID/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEditQuizData(data.quiz);
        setTitle(data.quiz.question);
        setDescription(data.quiz.correct_answer);
        setOptions(data.quiz.options || ["", "", "", ""]);
        setShowCreateForm(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching quiz");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/quizzes/deleteQuiz/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting quiz");
    }
  };

  const handleSaveQuiz = async () => {
    if (!title || !description) return alert("Question and correct answer required");

    const payload = {
      question: title,
      options, // You can make a proper input later
      correct_answer: description,
      module_id: moduleIdFromUrl || null,
    };

    try {
      let response;
      if (editQuizData) {
        response = await fetch(`http://localhost:3000/api/quizzes/editQuiz/${editQuizData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("http://localhost:3000/api/quizzes/createQuiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (response.ok) {
        setShowCreateForm(false);
        setTitle("");
        setDescription("");
        setEditQuizData(null);

        if (editQuizData) setQuizzes((prev) => prev.map((q) => (q.id === data.quiz.id ? data.quiz : q)));
        else setQuizzes((prev) => [...prev, data.quiz]);
      } else alert(data.message || "Save failed");
    } catch (err) {
      console.error(err);
      alert("Error saving quiz");
    }
  };



  // ------------------- MODULES -------------------
  const handleEditModule = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/modules/getModuleById/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEditModuleData(data.module);
        setTitle(data.module.title);
        setDescription(data.module.description);
        editor.commands.setContent(data.module.content);
        setShowCreateForm(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching module");
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/modules/deleteModule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting module");
    }
  };

  // ------------------- ARTICLES -------------------
  const handleEditArticle = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/articles/getArticleById/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEditArticleData(data.article);
        setTitle(data.article.title);
        setDescription(data.article.tags); // or body if you prefer
        editor.commands.setContent(data.article.body);
        setShowCreateForm(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching article");
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/articles/deleteArticle/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting article");
    }
  };

  // ------------------- SAVE (MODULE OR ARTICLE) -------------------
  const handleSave = async () => {
    if (!title) return alert("Title required");
    const contentJSON = editor.getJSON();
    const payload = {
      title,
      description,
      content: contentJSON,
    };

    try {
      let response;
      if (activeTab === "modules") {
        if (editModuleData) {
          response = await fetch(`http://localhost:3000/api/modules/editModule/${editModuleData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ title, description, content: contentJSON }),
          });
        } else {
          response = await fetch(`http://localhost:3000/api/modules/createModule`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ title, description, content: contentJSON }),
          });
        }
      } else if (activeTab === "articles") {
        if (editArticleData) {
          response = await fetch(`http://localhost:3000/api/articles/editArticle/${editArticleData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ title, body: contentJSON, tags: description }),
          });
        } else {
          response = await fetch(`http://localhost:3000/api/articles/createArticle`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ title, body: contentJSON, tags: description }),
          });
        }
      }

      const data = await response.json();
      if (response.ok) {
        setShowCreateForm(false);
        setTitle("");
        setDescription("");
        editor.commands.setContent("<p></p>");
        setEditModuleData(null);
        setEditArticleData(null);

        // Update local state
        if (activeTab === "modules") {
          if (editModuleData) setModules((prev) => prev.map((m) => (m.id === data.module.id ? data.module : m)));
          else setModules((prev) => [...prev, data.module]);
        } else if (activeTab === "articles") {
          if (editArticleData) setArticles((prev) => prev.map((a) => (a.id === data.article.id ? data.article : a)));
          else setArticles((prev) => [...prev, data.article]);
        }
      } else alert(data.message || "Save failed");
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  };

  // ------------------- DUMMY USERS AND ANALYTICS -------------------
  const [users] = useState([
    { id: 1, name: "John Doe", email: "johndoe@email.com" },
    { id: 2, name: "Jane Smith", email: "janesmith@email.com" },
  ]);
  const analytics = {
    totalUsers: 120,
    activeUsers: 95,
    completedModules: 300,
    moduleCompletion: { labels: ["Budgeting", "Investing"], data: [80, 60] },
    userCategories: { labels: ["Student", "Professional"], data: [40, 35] },
  };
  const moduleChartData = {
    labels: analytics.moduleCompletion.labels,
    datasets: [{ label: "Completed Users", data: analytics.moduleCompletion.data, backgroundColor: "#B5F042" }],
  };
  const userCategoryData = {
    labels: analytics.userCategories.labels,
    datasets: [{ label: "User Categories", data: analytics.userCategories.data, backgroundColor: ["#B5F042", "#9acc38"] }],
  };

  return (
    <div className="admin-dashboard-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li onClick={() => setActiveTab("users")}>Users</li>
          <li onClick={() => setActiveTab("modules")}>Modules</li>
          <li onClick={() => setActiveTab("quizzes")}>Quizzes</li>
          <li onClick={() => setActiveTab("articles")}>Articles</li>
          <li onClick={() => setActiveTab("analytics")}>Analytics</li>
          <li onClick={() => setActiveTab("feedback")}>Feedback</li>
        </ul>
      </nav>

      {/* Overview Cards */}
      <section className="overview-cards">
        <div className="overview-card">
          <FaUsers size={30} color="#B5F042" />
          <h3>Total Users</h3>
          <p>{analytics.totalUsers}</p>
        </div>
        <div className="overview-card">
          <FaBook size={30} color="#B5F042" />
          <h3>Completed Modules</h3>
          <p>{analytics.completedModules}</p>
        </div>
        <div className="overview-card">
          <FaChartBar size={30} color="#B5F042" />
          <h3>Active Users</h3>
          <p>{analytics.activeUsers}</p>
        </div>
      </section>

      {/* Tab Content */}
      <section className="tab-content">
        {/* Users */}
        {activeTab === "users" && (
          <div className="admin-section">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modules */}
        {activeTab === "modules" && (
          <div className="admin-section">
            <h2>Module Management</h2>
            <button className="createNewModBtn" onClick={() => setShowCreateForm(true)}>
              Create New Module +
            </button>

            <ul className="module-list">
              {modules.map((m) => (
                <li key={m.id}>
                  <Link to={`/admin/modules/${m.id}`}>{m.title}</Link>
                  <button className="edit-btn" onClick={() => handleEditModule(m.id)}>Edit</button>{" "}
                  <button className="delete-btn" onClick={() => handleDeleteModule(m.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quizzes */}
        {activeTab === "quizzes" && (
          <div className="admin-section">
            <h2>Quiz Management</h2>
            <button
              className="createNewModBtn"
              onClick={() => {
                setShowCreateForm(true);
                setEditQuizData(null);
                setTitle("");
                setDescription("");
              }}
            >
              Create New Quiz +
            </button>

            <ul className="module-list">
              {quizzes.map((q) => (
                <li key={q.id}>
                  <Link to={`/admin/quizzes/view/${q.id}`}>{q.question}</Link>
                  <button className="edit-btn" onClick={() => handleEditQuiz(q.id)}>Edit</button>{" "}
                  <button className="delete-btn" onClick={() => handleDeleteQuiz(q.id)}>Delete</button>
                </li>

              ))}
            </ul>
          </div>
        )}


        {/* Articles */}
        {activeTab === "articles" && (
          <div className="admin-section">
            <h2>Article Management</h2>

            {/* CREATE ARTICLE BUTTON */}
            <button
              className="createNewModBtn"
              onClick={() => {
                setShowCreateForm(true);
                setEditArticleData(null); // ensure it's in "create" mode
                setTitle("");
                setDescription("");
                editor.commands.setContent("<p></p>");
              }}
            >
              Create New Article +
            </button>

            <ul className="module-list">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link to={`/admin/articles/${a.id}`}>{a.title}</Link>{" "}
                  <button className="edit-btn" onClick={() => handleEditArticle(a.id)}>Edit</button>{" "}
                  <button className="delete-btn" onClick={() => handleDeleteArticle(a.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="charts-section">
            <div className="chart-card">
              <h3>Module Completion</h3>
              <Bar data={moduleChartData} options={{ responsive: true }} />
            </div>

            <div className="chart-card">
              <h3>User Category Distribution</h3>
              <Pie data={userCategoryData} options={{ responsive: true }} />
            </div>
          </div>
        )}

        {/* Feedback */}
        {activeTab === "feedback" && (
          <div className="admin-section">
            <h2>Feedback Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.user}</td>
                    <td>{f.message}</td>
                    <td>{f.status}</td>
                    <td>
                      <button onClick={() => handleReply(f.id)}>Reply</button>
                      <button onClick={() => handleResolve(f.id)}>
                        Mark Resolved
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create/Edit Module/Article Modal */}
      {showCreateForm && (
        <div className="createModuleOverlay">
          <div className="createModuleBg">
            <button className="close-btn" onClick={() => setShowCreateForm(false)}>✖</button>

            {/* MODULES FORM */}
            {activeTab === "modules" && (
              <>
                <h2>{editModuleData ? "Edit Module" : "Create Module"}</h2>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="editor-toolbar">
                  <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                  <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
                  <button onClick={addImage}>🖼️</button>
                </div>

                <EditorContent editor={editor} className="editor" />

                <button className="saveModuleBtn" onClick={handleSave}>Save</button>
              </>
            )}

            {/* ARTICLES FORM */}
            {activeTab === "articles" && (
              <>
                <h2>{editArticleData ? "Edit Article" : "Create Article"}</h2>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Tags (comma-separated)</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="editor-toolbar">
                  <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                  <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
                  <button onClick={addImage}>🖼️</button>
                </div>

                <EditorContent editor={editor} className="editor" />

                <button className="saveModuleBtn" onClick={handleSave}>Save</button>
              </>
            )}

            {/* QUIZZES FORM */}
            {activeTab === "quizzes" && (
              <>
                <h2>{editQuizData ? "Edit Quiz" : "Create Quiz"}</h2>

                <label>Question</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Correct Answer</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

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
                      onClick={() => {
                        const newOptions = options.filter((_, i) => i !== idx);
                        setOptions(newOptions);
                      }}
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setOptions([...options, ""])}
                  style={{ marginTop: "5px" }}
                >
                  ➕ Add Option
                </button>


                <button className="saveModuleBtn" onClick={handleSaveQuiz}>Save</button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
