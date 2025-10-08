// File: src/public/Insurance.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
// ... other imports ...

// Configuration
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const InsurancePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [feedback, setFeedback] = useState({ comments: [], avgRating: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Authentication ---
  const checkToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token);
      } catch (e) {
        console.error("Invalid token:", e);
        // navigate("/login"); // Optional: redirect on invalid token
      }
    }
  }, []);

  // 1. FETCH FEEDBACK
  const fetchFeedback = useCallback(async (id) => {
    if (!id) {
      setFeedback({ comments: [], avgRating: 0 });
      return;
    }

    try {
      // NOTE: This route should only return public/sanitized data (no user name/email)
      const res = await axios.get(`/api/insurance-sections/${id}/feedback`);
      setFeedback(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err.message);
      setFeedback({ comments: [], avgRating: 0 });
    }
  }, []);

  // 2. HANDLER: SELECT SECTION
  const handleSectionSelect = useCallback(
    (id) => {
      setSelectedSectionId(id);
      fetchFeedback(id); // Triggers feedback fetch
    },
    [fetchFeedback]
  );

  // 3. FETCH SECTIONS
  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/insurance-sections");
      const fetchedSections = Array.isArray(res.data) ? res.data : [];
      setSections(fetchedSections);

      if (fetchedSections.length > 0 && selectedSectionId === null) {
        handleSectionSelect(fetchedSections[0].id);
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
      setError(
        "Failed to load insurance topics. Check server status or database data."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedSectionId, handleSectionSelect]);

  // --- Handlers ---

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const rating = parseInt(e.target.rating.value, 10);
    const comment = e.target.comment.value;
    const token = localStorage.getItem("token");

    if (!selectedSectionId) {
      setError("Please select a topic before submitting feedback.");
      return;
    }
    if (!token) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    let name = null;
    let email = null;

    // 🟢 CRITICAL CHANGE: Decode token to get user profile data
    try {
      const decoded = jwtDecode(token);
      // Assuming your token payload includes name and email fields
      name = decoded.name || decoded.userName || null;
      email = decoded.email || null;
    } catch (e) {
      console.error("Failed to decode token for feedback submission:", e);
      setError("Invalid user session. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `/api/insurance-sections/${selectedSectionId}/feedback`,
        // 🟢 Include name and email in the POST payload
        { rating, comment, name, email }
      );
      fetchFeedback(selectedSectionId);
      e.target.reset();
      alert("Feedback submitted successfully! Thank you.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to submit feedback. Check authentication."
      );
      console.error("Submission error:", err);
    }
  };

  // --- Effects ---
  useEffect(() => {
    checkToken();
    fetchSections();
  }, [checkToken, fetchSections]);

  // Derived State
  const currentSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId);
  }, [sections, selectedSectionId]);

  // --- Rendering (Unchanged) ---
  if (loading && sections.length === 0)
    return <div className="loading-state">Loading Insurance Topics...</div>;
  if (error && sections.length === 0)
    return <div className="error-state">{error}</div>;

  return (
    <div className="insurance-page">
      <NavbarAfterLogin />

      <div className="main-content container">
        <h1>Our Insurance Policies</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="insurance-layout">
          {/* --- Left Column: Section List --- */}
          <div className="section-list-panel">
            <h2>Topics</h2>
            <ul className="section-list">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className={section.id === selectedSectionId ? "active" : ""}
                  onClick={() => handleSectionSelect(section.id)}
                >
                  {section.title}
                </li>
              ))}
            </ul>
          </div>

          {/* --- Right Column: Content & Feedback --- */}
          <div className="section-detail-panel">
            {currentSection ? (
              <>
                <h2>{currentSection.title}</h2>
                <div
                  className="section-content"
                  dangerouslySetInnerHTML={{ __html: currentSection.content }}
                />

                {/* --- Feedback Display --- */}
                <div className="feedback-area">
                  <h3>User Feedback (Avg Rating: {feedback.avgRating}/5)</h3>

                  <div className="comments-list">
                    {feedback.comments.length > 0 ? (
                      feedback.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <strong>Rating: {comment.rating}/5</strong>
                          <p>{comment.comment}</p>
                          <small>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      ))
                    ) : (
                      <p>No feedback yet. Be the first!</p>
                    )}
                  </div>

                  {/* Submission Form */}
                  <form
                    onSubmit={handleSubmitFeedback}
                    className="feedback-form"
                  >
                    <h4>Submit Your Feedback</h4>
                    <label htmlFor="rating">Rating (1-5):</label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      required
                    />
                    <label htmlFor="comment">Comment (Optional):</label>
                    <textarea id="comment" name="comment"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                </div>
              </>
            ) : (
              <p className="select-prompt">
                Please select an insurance topic to view its details.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InsurancePage;
