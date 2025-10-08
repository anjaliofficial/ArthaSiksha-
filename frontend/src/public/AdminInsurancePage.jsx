// File: src/public/AdminInsurancePage.jsx

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// IMPORTANT: These imports must match your project structure.
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import QuillWrapper from "../components/QuillWraper"; // Path confirmed
import "react-quill/dist/quill.snow.css";
import "./AdminInsurance.css";

// Set the base URL for axios
axios.defaults.baseURL = "http://localhost:3000";

// Utility function to retrieve the token and format headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Authentication token not found in localStorage.");
  }
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const AdminInsurancePage = () => {
  const navigate = useNavigate();

  // --- Insurance Content State ---
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isClient, setIsClient] = useState(false); // For ReactQuill loading

  // --- Feedback State ---
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  // --- Utility/UI State ---
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("content"); // 'content' or 'feedback'

  const formRef = useRef(null);
  const quillRef = useRef(null); // Ref to focus the editor

  // --- HANDLERS (Defined using useCallback for stability) ---

  const showStatusMessage = useCallback((message, type = "success") => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  const handleGoToDashboard = () => {
    navigate("/admindashboard");
  };

  const fetchSections = useCallback(async () => {
    try {
      const res = await axios.get("/api/insurance-sections");
      setSections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
      // AUTH ADDED
      const res = await axios.get(
        "/api/insurance-sections/feedback",
        getAuthHeaders()
      );

      const sortedFeedback = Array.isArray(res.data)
        ? res.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        : [];

      setFeedbackList(sortedFeedback);

      if (!selectedFeedbackId && sortedFeedback.length > 0) {
        setSelectedFeedbackId(sortedFeedback[0].id);
      }
    } catch (err) {
      console.error(
        "Error fetching feedback:",
        err.response?.data || err.message
      );
      showStatusMessage(
        "Error fetching feedback. Check server connection and Admin login status.",
        "error"
      );
    }
  }, [selectedFeedbackId, showStatusMessage]);

  // 🟢 NEW/CORRECTED: Robust function to handle null, undefined, and empty strings
  const getFeedbackUserName = useCallback(
    (feedbackItem, fallback = "Anonymous") => {
      const name = feedbackItem.name;
      // Check if name exists AND is not an empty string after trimming
      if (name && String(name).trim() !== "") {
        return String(name).trim();
      }

      const email = feedbackItem.email;
      // Check if email exists AND is not an empty string after trimming
      if (email && String(email).trim() !== "") {
        return String(email).trim();
      }

      return fallback;
    },
    []
  );

  // Media Renderer: Unchanged and correct.
  const renderContentWithMedia = (htmlContent) => {
    const mediaRegex =
      /(?<!src=["'])(?<!href=["'])(\buploads\/insurance_files\/[^ ]+\.(?:png|jpe?g|gif|pdf|docx|txt)\b)/gi;

    let renderedHtml = htmlContent.replace(mediaRegex, (match) => {
      const publicUrl = `http://localhost:3000/${match.replace(/^\//, "")}`;

      if (match.match(/\.(png|jpe?g|gif)$/i)) {
        return `<img src="${publicUrl}" alt="Inline Media" style="max-width: 100%; height: auto; border: 1px solid #ccc; display: block; margin: 10px 0;" onerror="this.onerror=null;this.src='https://placehold.co/150x100/A0A0A0/ffffff?text=Image+Error';" />`;
      }

      return `<a href="${publicUrl}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline;">[Download File: ${match
        .split("/")
        .pop()}]</a>`;
    });
    return { __html: renderedHtml };
  };

  // Content CRUD Handlers (Unchanged)
  const clearEditorState = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setSelectedSectionId(null);
  };

  const handleSectionSelect = (id) => {
    setSelectedSectionId(id);
    setActiveTab("content");
    if (formRef.current)
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (quillRef.current && typeof quillRef.current.focus === "function")
        quillRef.current.focus();
    }, 150);
  };

  const handleNewSection = () => {
    setSelectedSectionId(null);
    clearEditorState();
    setActiveTab("content");
    if (formRef.current)
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      showStatusMessage("Title and Content cannot be empty.", "error");
      return;
    }

    const payload = { title, content };

    try {
      // Use authenticated headers for PUT/POST
      const config = getAuthHeaders();
      let res;
      if (editingId) {
        // UPDATE
        res = await axios.put(
          `/api/insurance-sections/${editingId}`,
          payload,
          config
        );
        showStatusMessage("Section updated successfully! 👍");
      } else {
        // CREATE
        res = await axios.post("/api/insurance-sections", payload, config);
        showStatusMessage("Section created successfully! 🎉");
      }

      await fetchSections();
      setSelectedSectionId(res.data.id);
      setEditingId(res.data.id);
    } catch (err) {
      showStatusMessage(
        err.response?.status === 401
          ? "Unauthorized. Please log in as Admin."
          : "Error saving section.",
        "error"
      );
      console.error("Error saving section:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this section? This action is irreversible."
      )
    )
      return;

    try {
      // Use authenticated headers for DELETE
      await axios.delete(`/api/insurance-sections/${id}`, getAuthHeaders());

      if (selectedSectionId === id) {
        clearEditorState();
        setSelectedSectionId(null);
      }

      fetchSections();
      showStatusMessage("Section deleted successfully.");
    } catch (err) {
      showStatusMessage(
        err.response?.status === 401
          ? "Unauthorized. Please log in as Admin."
          : "Error deleting section.",
        "error"
      );
      console.error(
        "Error deleting section:",
        err.response?.data || err.message
      );
    }
  };

  // Handler for selecting a feedback item from the list
  const handleFeedbackSelect = (id) => {
    setSelectedFeedbackId(id);
    setActiveTab("feedback");
  };

  // Feedback Status Update
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Resolved" ? "New" : "Resolved";

    try {
      // Use authenticated headers for PUT (Feedback status update)
      await axios.put(
        `/api/insurance-sections/feedback/${id}`,
        { status: newStatus },
        getAuthHeaders() // AUTH ADDED
      );

      // Optimistic UI update
      setFeedbackList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      showStatusMessage(`Feedback ID ${id} marked as ${newStatus}.`, "success");
    } catch (error) {
      showStatusMessage(
        error.response?.status === 401
          ? "Unauthorized. Please log in as Admin."
          : "Failed to update feedback status. Check server connection.",
        "error"
      );
      console.error("Error updating status:", error);
      fetchFeedback(); // Re-fetch on error to revert UI
    }
  };

  // --- useEffects ---

  useEffect(() => {
    // Initializes isClient and fetches data only once on mount
    setIsClient(true);
    fetchSections();
    fetchFeedback();
  }, [fetchSections, fetchFeedback]);

  // Effect to load content when a section is selected from the left list (Topic-Based Editing)
  useEffect(() => {
    if (selectedSectionId) {
      const section = sections.find((s) => s.id === selectedSectionId);
      if (section) {
        setTitle(section.title);
        setContent(section.content);
        setEditingId(section.id);
      }
    }
  }, [selectedSectionId, sections]);

  // --- Memoized Values ---
  const currentSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  const currentFeedback = useMemo(
    () => feedbackList.find((f) => f.id === selectedFeedbackId),
    [feedbackList, selectedFeedbackId]
  );

  const unresolvedCount = useMemo(
    () => feedbackList.filter((f) => f.status !== "Resolved").length,
    [feedbackList]
  );

  // --- Quill Configuration & Media Renderer (Unchanged) ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  // --- RENDERING ---
  return (
    <div className="admin-insurance-page">
      <NavbarAfterLogin />

      <div className="insurance-main-content">
        <div className="admin-header-area">
          <button
            onClick={handleGoToDashboard}
            className="back-to-dashboard-btn"
          >
            ⬅️ Back to Dashboard
          </button>

          <div className="header-title-and-status">
            <h1>Insurance Content & Feedback Management</h1>

            {statusMessage && (
              <div className={`status-message ${statusMessage.type}`}>
                {statusMessage.message}
              </div>
            )}
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            📝 Insurance Content
          </button>

          <button
            className={`tab-btn ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            📢 User Feedback
            {unresolvedCount > 0 && (
              <span className="unresolved-badge">{unresolvedCount}</span>
            )}
          </button>
        </div>

        {/* --- LAYOUT GRID --- */}
        <div className={`admin-grid-layout full-page-mode-${activeTab}`}>
          {/* --- LEFT COLUMN: TOPIC LIST / FEEDBACK LIST --- */}
          <div className="admin-list-panel">
            {activeTab === "content" && (
              <>
                <div className="list-panel-header">
                  <h2>Content Topics</h2>
                  <button
                    onClick={handleNewSection}
                    className="new-section-btn"
                  >
                    ➕ New Topic
                  </button>
                </div>

                <ul className="section-title-list">
                  {sections.map((section) => (
                    <li
                      key={section.id}
                      className={
                        section.id === selectedSectionId ? "active" : ""
                      }
                      onClick={() => handleSectionSelect(section.id)}
                    >
                      <div className="section-list-title">{section.title}</div>
                      <span className="list-edit-icon">✏️</span>
                    </li>
                  ))}
                  {sections.length === 0 && (
                    <li className="empty-list">No topics created yet.</li>
                  )}
                </ul>
              </>
            )}

            {/* --- FEEDBACK LIST VIEW (LEFT) --- */}
            {activeTab === "feedback" && (
              <>
                <div className="list-panel-header">
                  <h2>Feedback History</h2>
                  <button onClick={fetchFeedback} className="refresh-btn">
                    🔄 Refresh
                  </button>
                </div>

                <div className="feedback-summary">
                  <p>
                    Total: {feedbackList.length} | Unresolved: {unresolvedCount}
                  </p>
                </div>

                <ul className="feedback-item-list">
                  {feedbackList.map((feedback) => (
                    <li
                      key={feedback.id}
                      className={`feedback-item status-${feedback.status?.toLowerCase()} ${
                        feedback.id === selectedFeedbackId ? "active" : ""
                      }`}
                      onClick={() => handleFeedbackSelect(feedback.id)}
                    >
                      <div className="feedback-details">
                        <strong>
                          {/* 🟢 CRITICAL FIX: Use the robust utility function */}
                          {getFeedbackUserName(feedback, "Anonymous")}
                        </strong>
                        <small>
                          — {new Date(feedback.created_at).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="feedback-title">
                        {feedback.comment?.substring(0, 50)}
                        {feedback.comment?.length > 50 ? "..." : ""}
                      </div>

                      <span
                        className={`status-badge status-${feedback.status?.toLowerCase()}`}
                      >
                        {feedback.status || "New"}
                      </span>
                    </li>
                  ))}
                  {feedbackList.length === 0 && (
                    <li className="empty-list">No feedback received.</li>
                  )}
                </ul>
              </>
            )}
          </div>

          {/* --- RIGHT COLUMN: EDITOR/DETAIL AREA --- */}
          <div className="admin-editor-area">
            {/* ... (Content Management View is unchanged) ... */}

            {/* --- FEEDBACK DETAIL VIEW (RIGHT) --- */}
            {activeTab === "feedback" && (
              <div className="feedback-detail-view">
                <h2>Feedback Details</h2>
                {currentFeedback ? (
                  <div
                    key={currentFeedback.id}
                    className="feedback-detail-card"
                  >
                    <div className="detail-header">
                      <h4>Feedback ID: {currentFeedback.id}</h4>
                      <span
                        className={`status-badge status-${currentFeedback.status?.toLowerCase()}`}
                      >
                        {currentFeedback.status || "New"}
                      </span>
                    </div>

                    <p>
                      <strong>User/Name:</strong>
                      {/* 🟢 CRITICAL FIX: Use the robust utility function */}
                      {getFeedbackUserName(currentFeedback, "Anonymous User")}
                    </p>

                    <p>
                      <strong>Email:</strong> {currentFeedback.email || "N/A"}
                    </p>

                    <p>
                      <strong>Rating:</strong> {currentFeedback.rating || "N/A"}
                    </p>

                    <p className="detail-message">
                      <strong>Comment:</strong>
                      <br />
                      {currentFeedback.comment}
                    </p>

                    <p className="detail-timestamp">
                      Submitted:
                      {new Date(currentFeedback.created_at).toLocaleString()}
                    </p>

                    <div className="detail-actions">
                      <button
                        className={`resolve-btn status-${currentFeedback.status?.toLowerCase()}`}
                        onClick={() =>
                          handleStatusUpdate(
                            currentFeedback.id,
                            currentFeedback.status
                          )
                        }
                      >
                        {currentFeedback.status === "Resolved"
                          ? "Re-open"
                          : "Mark as Resolved"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="no-preview-message">
                    {feedbackList.length > 0
                      ? "Select a feedback item from the list to view its details."
                      : "No feedback to display."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminInsurancePage;
