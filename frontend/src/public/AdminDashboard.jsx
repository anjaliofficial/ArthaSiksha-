import React, { useState, useEffect } from "react";
import { FaUsers, FaBook, FaChartBar } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import "./AdminDashboard.css";
import logo from "../assets/logoWhite.png";
import Placeholder from "@tiptap/extension-placeholder";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for external redirects
  const queryParams = new URLSearchParams(location.search);
  const moduleIdFromUrl = queryParams.get("moduleId");
  const tabFromUrl = queryParams.get("tab"); // e.g., ?tab=quizzes
  // Initialize with 'users' or a tab from URL
  const [activeTab, setActiveTab] = useState(tabFromUrl || "users");

  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [adminProfile, setAdminProfile] = useState({ username: "", email: "" });

  // Modules state
  const [modules, setModules] = useState([]);
  const [editModuleData, setEditModuleData] = useState(null);

  // Quizzes state
  const [quizzes, setQuizzes] = useState([]);
  const [editQuizData, setEditQuizData] = useState(null);
  const [moduleId, setModuleId] = useState("");
  const [questions, setQuestions] = useState([
    { question_text: "", options: ["", "", "", ""], correct_answer: "" },
  ]);
  const [options, setOptions] = useState(["", "", "", ""]);

  // Articles state
  const [articles, setArticles] = useState([]);
  const [editArticleData, setEditArticleData] = useState(null);

  // Editor modal state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // modules: description, articles: tags/body

  const [currentUser, setCurrentUser] = useState(null);

  // --- NEW FEEDBACK STATE (Dummy Data) ---
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      user: "UserA",
      message: "Can't upload profile picture.",
      status: "Open",
    },
    {
      id: 2,
      user: "UserB",
      message: "Typo in Module 3 title.",
      status: "Resolved",
    },
    {
      id: 3,
      user: "UserC",
      message: "Need more detail on SIPs.",
      status: "Open",
    },
  ]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: "Start typing here..." }),
    ],
    content: "<p></p>",
    editorProps: { attributes: { class: "editor-content" } },
  });

  // --- NEW HANDLERS FOR FINANCIAL LINKS ---
  const handleRedirect = (path) => {
    // Navigate to the external page/route
    navigate(path);
  };

  // A helper function to switch tab and clear edit data
  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setEditUserData(null);
    setEditModuleData(null);
    setEditQuizData(null);
    setEditArticleData(null);
    setShowCreateForm(false);
    editor?.commands.setContent("<p></p>");
  };

  // --- NEW HANDLERS FOR FEEDBACK ---
  const handleReply = (id) => {
    const feedback = feedbacks.find((f) => f.id === id);
    alert(`Replying to ${feedback.user}: "${feedback.message}"`);
    // In a real app, this would open a reply modal/form
  };

  const handleResolve = (id) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "Resolved" } : f))
    );
    alert(`Feedback ID ${id} marked as Resolved.`);
  };
  // ------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect to login page
  };

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

  const openQuizModal = () => {
    setShowCreateForm(true);
    setEditQuizData(null);
    setTitle("");
    setDescription("");
    setOptions(["", "", "", ""]);
    const url = new URL(window.location);
    url.searchParams.set("tab", "quizzes");
    window.history.replaceState({}, "", url);
  };

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/getAllUsers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setUsers(data.users); // ⚠️ here, make sure data.users[i].role exists
        console.log(data.users);
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch Modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/modules/getAllModules",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setModules(data.modules);
      } catch (err) {
        console.error(err);
      }
    };
    fetchModules();
  }, []);

  // Fetch admin profile when dashboard mounts
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAdminProfile({
            username: data.username || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };
    fetchAdminProfile();
  }, []);

  // Save admin profile
  const handleSaveAdminProfile = async () => {
    try {
      const payload = {
        username: adminProfile.username,
        email: adminProfile.email,
      };
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) alert("✅ Profile updated successfully!");
      else alert(data.message || "❌ Failed to update profile");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating profile");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      // Update state based on response from backend
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
      );

      alert(`✅ Role updated to ${data.user.role}`);
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  // Fetch Articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/articles/getAllArticles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
        const url = moduleIdFromUrl
          ? `http://localhost:3000/api/quizzes/getQuizzesByModule/${moduleIdFromUrl}`
          : "http://localhost:3000/api/quizzes/getAllQuizzes";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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
      const res = await fetch(
        `http://localhost:3000/api/quizzes/GetQuizByID/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setEditQuizData(data.quiz);
        setModuleId(data.quiz.module_id || "");

        const parsedQuestions = data.questions.map((q) => {
          let opts = [];
          try {
            opts =
              typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          } catch (err) {
            opts = ["", "", "", ""]; // fallback
          }
          return {
            id: q.id,
            question_text: q.question_text || "",
            options: opts.length ? opts : ["", "", "", ""],
            correct_answer: q.correct_answer || "",
          };
        });
        setQuestions(parsedQuestions);

        setShowCreateForm(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching quiz");
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/quizzes/deleteQuiz/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting quiz");
    }
  };

  // Save quiz
  const handleSaveQuiz = async () => {
    if (!moduleId) return alert("Please select a module");
    if (!questions.length) return alert("Add at least one question");

    // Validate questions
    for (const q of questions) {
      if (!q.question_text.trim()) return alert("All questions must have text");
      if (q.options.length < 2 || q.options.some((opt) => !opt.trim()))
        return alert("All options must be filled (at least 2)");
      if (
        !q.correct_answer ||
        (Array.isArray(q.correct_answer) && !q.correct_answer.length)
      )
        return alert("Correct answer required for each question");
    }

    const payload = {
      module_id: moduleId,
      title, // Proper quiz title
      questions: questions.map((q) => ({
        id: q.id,
        question_text: q.question_text.trim(),
        options: q.options.map((opt) => opt.trim()).filter((opt) => opt), // remove empty strings
        correct_answer: Array.isArray(q.correct_answer)
          ? q.correct_answer.map((ans) => ans.trim())
          : [q.correct_answer.trim()], // always send as array
      })),
    };

    try {
      const url = editQuizData
        ? `http://localhost:3000/api/quizzes/editQuiz/${editQuizData.id}`
        : "http://localhost:3000/api/quizzes/createQuiz";
      const method = editQuizData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Quiz saved successfully!");
        setShowCreateForm(false);
        setQuestions([
          { question_text: "", options: ["", "", "", ""], correct_answer: "" },
        ]);
        setEditQuizData(null);

        // Update local state
        if (editQuizData) {
          setQuizzes((prev) =>
            prev.map((q) =>
              q.id === data.quiz.id
                ? { ...data.quiz, questions: data.questions }
                : q
            )
          );
        } else {
          setQuizzes((prev) => [
            ...prev,
            { ...data.quiz, questions: data.questions },
          ]);
        }
      } else {
        alert(data.message || "Failed to save quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving quiz");
    }
  };

  // ------------------- USERS -------------------

  const handleSaveUser = async (username, email, password) => {
    try {
      const isEdit = editUserData && editUserData.id;
      const url = isEdit
        ? `http://localhost:3000/api/users/editUser/${editUserData.id}`
        : "http://localhost:3000/api/users/createUser";

      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { username, email }
        : { username, email, password };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "❌ Failed to save user");
        return;
      }

      alert("✅ User saved successfully!");
      setEditUserData(null);

      setUsers((prev) => {
        if (isEdit) {
          return prev.map((u) =>
            u.id === editUserData.id ? { ...u, username, email } : u
          );
        } else {
          return [...prev, data.user];
        }
      });
    } catch (err) {
      console.error("Error saving user: ", err);
      alert("❌ An unexpected error occurred.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user: ", err);
    }
  };

  // ------------------- MODULES -------------------
  const handleEditModule = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/modules/getModuleById/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      const res = await fetch(
        `http://localhost:3000/api/modules/deleteModule/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting module");
    }
  };

  // ------------------- ARTICLES -------------------
  const handleEditArticle = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/articles/getArticleById/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      const res = await fetch(
        `http://localhost:3000/api/articles/deleteArticle/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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

    try {
      let response;
      if (activeTab === "modules") {
        if (editModuleData) {
          response = await fetch(
            `http://localhost:3000/api/modules/editModule/${editModuleData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                title,
                description,
                content: contentJSON,
              }),
            }
          );
        } else {
          response = await fetch(
            `http://localhost:3000/api/modules/createModule`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                title,
                description,
                content: contentJSON,
              }),
            }
          );
        }
      } else if (activeTab === "articles") {
        if (editArticleData) {
          response = await fetch(
            `http://localhost:3000/api/articles/editArticle/${editArticleData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                title,
                body: contentJSON,
                tags: description,
              }),
            }
          );
        } else {
          response = await fetch(
            `http://localhost:3000/api/articles/createArticle`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                title,
                body: contentJSON,
                tags: description,
              }),
            }
          );
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
          if (editModuleData)
            setModules((prev) =>
              prev.map((m) => (m.id === data.module.id ? data.module : m))
            );
          else setModules((prev) => [...prev, data.module]);
        } else if (activeTab === "articles") {
          if (editArticleData)
            setArticles((prev) =>
              prev.map((a) => (a.id === data.article.id ? data.article : a))
            );
          else setArticles((prev) => [...prev, data.article]);
        }
      } else alert(data.message || "Save failed");
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  };

  // ------------------- DUMMY ANALYTICS -------------------

  const analytics = {
    totalUsers: 120,
    activeUsers: 95,
    completedModules: 300,
    moduleCompletion: { labels: ["Budgeting", "Investing"], data: [80, 60] },
    userCategories: { labels: ["Student", "Professional"], data: [40, 35] },
  };
  const moduleChartData = {
    labels: analytics.moduleCompletion.labels,
    datasets: [
      {
        label: "Completed Users",
        data: analytics.moduleCompletion.data,
        backgroundColor: "#B5F042",
      },
    ],
  };
  const userCategoryData = {
    labels: analytics.userCategories.labels,
    datasets: [
      {
        label: "User Categories",
        data: analytics.userCategories.data,
        backgroundColor: ["#B5F042", "#9acc38"],
      },
    ],
  };

  // --- Render Editor/Modal for Modules/Articles/Quizzes ---
  const renderEditorModal = () => {
    if (!showCreateForm) return null;

    if (activeTab === "quizzes") {
      // In a real app, you would move this complex Quiz creation UI to a separate component
      // For simplicity here, I'll just show the header and close button.
      return (
        <div className="createModuleOverlay">
          <div className="createModuleBg">
            <button
              className="close-btn"
              onClick={() => setShowCreateForm(false)}
            >
              ❌
            </button>
            <h2>{editQuizData ? "Edit Quiz" : "Create New Quiz"}</h2>
            {/* The actual Quiz Builder UI would go here */}
            <p>Module ID: {moduleId}</p>
            <p>Title: {title}</p>
            <p>Questions: {questions.length}</p>
            <button className="saveModuleBtn" onClick={handleSaveQuiz}>
              {editQuizData ? "Update Quiz" : "Save Quiz"}
            </button>
          </div>
        </div>
      );
    }

    // Editor for Modules/Articles
    return (
      <div className="createModuleOverlay">
        <div className="createModuleBg">
          <button
            className="close-btn"
            onClick={() => setShowCreateForm(false)}
          >
            ❌
          </button>
          <h2>
            {editModuleData || editArticleData ? "Edit" : "Create New"}{" "}
            {activeTab === "modules" ? "Module" : "Article"}
          </h2>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>{activeTab === "modules" ? "Description" : "Tags"}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="editor-container">
            <div className="editor-toolbar">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
              >
                I
              </button>
              <button onClick={addImage}>🖼️ Add Image</button>
              {/* Add more toolbar buttons as needed */}
            </div>
            <EditorContent editor={editor} />
          </div>

          <button className="saveModuleBtn" onClick={handleSave}>
            Save {activeTab === "modules" ? "Module" : "Article"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/admindashboard">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          {/* Main Dashboard Tabs (Internal) */}
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => switchTab("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "modules" ? "active" : ""}
            onClick={() => switchTab("modules")}
          >
            Modules
          </li>
          <li
            className={activeTab === "quizzes" ? "active" : ""}
            onClick={() => switchTab("quizzes")}
          >
            Quizzes
          </li>
          <li
            className={activeTab === "articles" ? "active" : ""}
            onClick={() => switchTab("articles")}
          >
            Articles
          </li>
          <li
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => switchTab("analytics")}
          >
            Analytics
          </li>
          <li
            className={activeTab === "feedback" ? "active" : ""}
            onClick={() => switchTab("feedback")}
          >
            Feedback
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => switchTab("settings")}
          >
            Settings
          </li>

          {/* --- ADDED FINANCIAL LINKS (Placeholder Content) --- */}
          <li
            className={activeTab === "stocks" ? "active" : ""}
            onClick={() => switchTab("stocks")}
          >
            Stocks
          </li>
          <li
            className={activeTab === "mutualfunds" ? "active" : ""}
            onClick={() => switchTab("mutualfunds")}
          >
            Mutual Funds
          </li>
          <li
            className={activeTab === "sip" ? "active" : ""}
            onClick={() => switchTab("sip")}
          >
            SIP
          </li>
          <li
            className={activeTab === "insurance" ? "active" : ""}
            onClick={() => switchTab("insurance")}
          >
            Insurance
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      {/* Overview Cards (Only show if not in a content editor/modal) */}
      {!showCreateForm && (
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
      )}

      {/* Tab Content */}
      <section className="tab-content">
        {/* Users */}
        {activeTab === "users" && (
          <div className="admin-section">
            <h2>User Management</h2>
            <button
              className="createNewModBtn"
              onClick={() => {
                setEditUserData({
                  username: "",
                  email: "",
                  password: "",
                  id: null,
                }); // explicitly no id for Create mode
              }}
            >
              Create New User +
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.id === currentUser?.id} // prevent changing own role
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => setEditUserData(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === currentUser?.id} // prevent deleting self
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editUserData && (
              <div className="createModuleOverlay">
                <div className="createModuleBg">
                  <button
                    className="close-btn"
                    onClick={() => setEditUserData(null)}
                  >
                    ❌
                  </button>
                  <h2>{editUserData.id ? "Edit User" : "Create User"}</h2>
                  <label>Username</label>
                  <input
                    type="text"
                    value={editUserData.username}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        username: e.target.value,
                      })
                    }
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        email: e.target.value,
                      })
                    }
                  />
                  {!editUserData.id && (
                    <>
                      <label>Password</label>
                      <input
                        type="password"
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            password: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                  <button
                    className="saveModuleBtn"
                    onClick={() =>
                      handleSaveUser(
                        editUserData.username,
                        editUserData.email,
                        editUserData.password
                      )
                    }
                  >
                    Save User
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modules */}
        {activeTab === "modules" && (
          <div className="admin-section">
            <h2>Module Management</h2>
            <button
              className="createNewModBtn"
              onClick={() => {
                switchTab("modules");
                setShowCreateForm(true);
              }}
            >
              Create New Module +
            </button>

            <ul className="module-list">
              {modules.map((m) => (
                <li key={m.id}>
                  <Link to={`/admin/modules/${m.id}`}>{m.title}</Link>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditModule(m.id)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteModule(m.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quizzes list */}
        {activeTab === "quizzes" && (
          <div className="admin-section">
            <h2>Quiz Management</h2>
            <button
              className="createNewModBtn"
              onClick={() => {
                switchTab("quizzes");
                openQuizModal();
              }}
            >
              Create New Quiz +
            </button>

            <ul className="module-list">
              {quizzes.map((q) => (
                <li key={q.id}>
                  <span>
                    {q.title || "Untitled Quiz"} - Module ID: {q.module_id}
                  </span>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditQuiz(q.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteQuiz(q.id)}
                  >
                    Delete
                  </button>
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
                switchTab("articles");
                setShowCreateForm(true);
              }}
            >
              Create New Article +
            </button>

            <ul className="module-list">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link to={`/admin/articles/${a.id}`}>{a.title}</Link>{" "}
                  <button
                    className="edit-btn"
                    onClick={() => handleEditArticle(a.id)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteArticle(a.id)}
                  >
                    Delete
                  </button>
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

        {/* Feedback (Completed Section) */}
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
                    <td>
                      <span className={`status-${f.status.toLowerCase()}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleReply(f.id)}
                      >
                        Reply
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleResolve(f.id)}
                        disabled={f.status === "Resolved"}
                      >
                        {f.status === "Resolved" ? "Resolved" : "Mark Resolved"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings (New Section) */}
        {activeTab === "settings" && (
          <div className="admin-section">
            <h2>Admin Settings</h2>
            <div className="settings-form">
              <h3>Admin Profile</h3>
              <label>Username</label>
              <input
                type="text"
                value={adminProfile.username}
                onChange={(e) =>
                  setAdminProfile((p) => ({ ...p, username: e.target.value }))
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={adminProfile.email}
                onChange={(e) =>
                  setAdminProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
              <button
                className="saveModuleBtn"
                onClick={handleSaveAdminProfile}
              >
                Update Profile
              </button>
            </div>
            {/* Additional settings forms (e.g., API keys, site config) would go here */}
          </div>
        )}

        {/* --- ADDED FINANCIAL LINKS CONTENT (Placeholders) --- */}
        {/* --- ADDED FINANCIAL LINKS CONTENT (Now with Redirect Buttons) --- */}

        {activeTab === "stocks" && (
          <div className="admin-section">
            <h2>Stocks Management</h2>
            <p>
              This is where the admin can manage featured stock information,
              news, or user stock portfolio access.
            </p>
            <button
              className="createNewModBtn"
              onClick={() => navigate("/admin/stocks")} // Navigate to dedicated stocks management page
            >
              Go to Stocks Editor
            </button>
            <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#666" }}>
              (Clicking the button above redirects you to the dedicated content
              management page.)
            </p>
          </div>
        )}

        {activeTab === "mutualfunds" && (
          <div className="admin-section">
            <h2>Mutual Funds Management</h2>
            <p>
              This is where the admin can curate a list of recommended mutual
              funds or track popular fund performance.
            </p>
            <button
              className="createNewModBtn"
              onClick={() => navigate("/admin/mutualfunds")} // Navigate to dedicated mutual funds management page
            >
              Go to Mutual Funds Editor
            </button>
            <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#666" }}>
              (Clicking the button above redirects you to the dedicated content
              management page.)
            </p>
          </div>
        )}

        {activeTab === "sip" && (
          <div className="admin-section">
            <h2>SIP Management</h2>
            <p>
              This is where the admin can manage educational content or tools
              related to Systematic Investment Plans (SIP).
            </p>
            <button
              className="createNewModBtn"
              onClick={() => navigate("/admin/sip")} // Navigate to dedicated SIP management page
            >
              Go to SIP Editor
            </button>
            <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#666" }}>
              (Clicking the button above redirects you to the dedicated content
              management page.)
            </p>
          </div>
        )}

        {activeTab === "insurance" && (
          <div className="admin-section">
            <h2>Insurance Management</h2>
            <p>
              This is where the admin can manage content about different types
              of insurance (life, health, etc.).
            </p>
            <button
              className="createNewModBtn"
              onClick={() => navigate("/admin/insurance")} // Navigate to dedicated insurance management page
            >
              Go to Insurance Content Editor
            </button>
            <p style={{ marginTop: "15px", fontSize: "0.9em", color: "#666" }}>
              (Clicking the button above redirects you to the dedicated content
              management page.)
            </p>
          </div>
        )}
      </section>

      {/* Editor/Creation Modal (Modules, Articles, Quizzes) */}
      {renderEditorModal()}
    </div>
  );
};

export default AdminDashboard;
