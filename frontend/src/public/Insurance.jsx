import React, { useState, useEffect } from "react";
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import axios from "axios";
import "./Insurance.css";

axios.defaults.baseURL = "http://localhost:3000";

const InsurancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicSections, setDynamicSections] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});
  const [sectionFeedback, setSectionFeedback] = useState({});

  /**
   * Renders HTML content and replaces custom file paths with actual links/images.
   * FIX: Ensures the image/file URL path is constructed correctly for the user page.
   */
  const renderContentWithMedia = (htmlContent) => {
    // Regex to find paths like 'uploads/insurance_files/file.ext'
    const mediaRegex =
      /(?<!src=["'])(?<!href=["'])(\buploads\/insurance_files\/[^ ]+\.(?:png|jpe?g|gif|pdf|docx|txt)\b)/gi;

    let renderedHtml = htmlContent.replace(mediaRegex, (match) => {
      // Ensure the match path doesn't start with a slash if it's relative
      const cleanMatch = match.replace(/^\//, "");
      // Construct the full public URL
      const publicUrl = `http://localhost:3000/${cleanMatch}`;

      if (match.match(/\.(png|jpe?g|gif)$/i)) {
        // Return an image tag for image files
        return `<img src="${publicUrl}" alt="Inline Media" style="max-width: 100%; height: auto; border: 1px solid #ccc; display: block; margin: 10px 0;" onerror="this.onerror=null;this.src='https://placehold.co/150x100/A0A0A0/ffffff?text=Image+Error';" />`;
      }
      // Return a hyperlink for other file types
      return `<a href="${publicUrl}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline;">[Download File: ${match
        .split("/")
        .pop()}]</a>`;
    });

    return { __html: renderedHtml };
  };

  // --- Fetch Sections & Feedback ---
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get("/api/insurance-sections");
        setDynamicSections(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching sections:", err);
        setDynamicSections([]);
      }
    };

    const fetchFeedback = async () => {
      try {
        // FIX: Corrected endpoint to /api/insurance-sections/feedback
        const res = await axios.get("/api/insurance-sections/feedback");
        setSectionFeedback(res.data || {});
      } catch (err) {
        console.error(
          "Error fetching feedback:",
          err.response?.data || err.message
        );
      }
    };

    fetchSections();
    fetchFeedback();
  }, []);

  // --- Search Logic ---
  const handleSearch = () => {
    const query = searchTerm.toLowerCase();
    const matched = dynamicSections.find((section) =>
      section.title.toLowerCase().includes(query)
    );
    if (matched) {
      const element = document.getElementById(`dynamic-${matched.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.style.transition = "background-color 0.5s";
        element.style.backgroundColor = "#fff8c6";
        setTimeout(() => (element.style.backgroundColor = "transparent"), 2000);
      }
    } else {
      // FIX: Replaced alert()
      console.warn(`No section title found for "${searchTerm}"`);
    }
  };

  // --- Submit Feedback ---
  const submitFeedback = async (sectionId) => {
    const data = feedbackData[sectionId];
    // FIX: Replaced alert() with console error/warning
    if (!data || !data.comment?.trim() || !data.rating) {
      console.error(
        `Feedback submission failed for section ${sectionId}: Please enter a comment and select a rating.`
      );
      return;
    }

    try {
      // FIX: Corrected endpoint to /api/insurance-sections/:id/feedback
      await axios.post(`/api/insurance-sections/${sectionId}/feedback`, data);

      // Optimistically update the local state
      setSectionFeedback((prev) => {
        const prevComments = prev[sectionId]?.comments || [];
        // Add the new comment/rating to the front
        const newComments = [
          {
            comment: data.comment,
            rating: data.rating,
            created_at: new Date().toISOString(),
          },
          ...prevComments,
        ];

        const totalRating = newComments.reduce((sum, c) => sum + c.rating, 0);
        const avgRating = totalRating / newComments.length;

        return {
          ...prev,
          [sectionId]: {
            comments: newComments,
            avgRating,
          },
        };
      });

      // Clear the input form fields for the submitted section
      setFeedbackData((prev) => {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      });
      console.log(`Feedback submitted successfully for section ${sectionId}.`);
    } catch (err) {
      console.error(
        "Error submitting feedback:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="insurance-page">
      <NavbarAfterLogin />

      {/* Search Bar */}
      <div className="insurance-search-top">
        <input
          type="text"
          placeholder="Search topics managed by the Admin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="insurance-main">
        <h1>🛡️ Insurance Knowledge Hub</h1>

        {dynamicSections.length === 0 ? (
          <p className="loading-message">
            Loading content or no sections have been added by the administrator
            yet.
          </p>
        ) : (
          dynamicSections.map((section) => (
            <section
              key={section.id}
              id={`dynamic-${section.id}`}
              className="insurance-section dynamic-content"
            >
              <h2>{section.title}</h2>

              <div
                className="dynamic-content-body"
                dangerouslySetInnerHTML={renderContentWithMedia(
                  section.content
                )}
              />

              {/* Average Rating */}
              <div className="average-rating">
                Average Rating:{" "}
                <span className="rating-value">
                  {sectionFeedback[section.id]?.avgRating
                    ? sectionFeedback[section.id].avgRating.toFixed(1)
                    : "No ratings yet"}
                </span>
              </div>

              {/* Existing Comments */}
              <div className="comments-list">
                <h4 className="comments-header">User Feedback</h4>
                {(sectionFeedback[section.id]?.comments || []).length > 0 ? (
                  (sectionFeedback[section.id]?.comments || []).map(
                    (c, idx) => (
                      <div
                        key={`${section.id}-${idx}`}
                        className="comment-item"
                      >
                        <div className="comment-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= c.rating ? "filled" : ""}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="comment-text">{c.comment}</p>
                        <small className="comment-date">
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </div>
                    )
                  )
                ) : (
                  <p className="no-comments">
                    Be the first to leave a comment!
                  </p>
                )}
              </div>

              {/* Leave Feedback Form */}
              <div className="feedback-section">
                <h4>Leave Feedback / Rating</h4>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        (feedbackData[section.id]?.rating || 0) >= star
                          ? "filled"
                          : ""
                      }`}
                      onClick={() =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            rating: star,
                            comment: prev[section.id]?.comment || "",
                          },
                        }))
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Write your comment..."
                  value={feedbackData[section.id]?.comment || ""}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      [section.id]: {
                        ...prev[section.id],
                        comment: e.target.value,
                        rating: prev[section.id]?.rating || 0,
                      },
                    }))
                  }
                />
                <button
                  onClick={() => submitFeedback(section.id)}
                  disabled={!feedbackData[section.id]?.rating}
                >
                  Submit Feedback
                </button>
              </div>
            </section>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InsurancePage;
