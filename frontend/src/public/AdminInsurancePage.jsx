import React, { useState, useEffect } from "react";
import axios from "axios";
// Assuming these are defined elsewhere
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
// IMPORTANT: Importing the fixed wrapper component
import QuillWrapper from "../components/QuillWraper";
import "react-quill/dist/quill.snow.css";
import "./AdminInsurancePage.css";

axios.defaults.baseURL = "http://localhost:3000";

const AdminInsurancePage = () => {
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");
  const [editingId, setEditingId] = useState(null);

  // FIX: State to track if the component has mounted client-side.
  // This prevents React Strict Mode's double-invocation from breaking Quill.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to true after the initial mount cycle.
    setIsClient(true);
    fetchSections();
  }, []);

  /**
   * Handles copying text to the clipboard.
   */
  const copyToClipboard = (text) => {
    // Fallback approach using document.execCommand('copy') which is more reliable in iFrames
    try {
      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      console.log("Path copied to clipboard successfully!");
    } catch (err) {
      console.error("Could not copy text to clipboard:", err);
    }
  };

  /**
   * Renders HTML content and replaces custom file paths with actual links/images.
   */
  const renderContentWithMedia = (htmlContent) => {
    // Regex to find paths like 'uploads/insurance_files/file.ext'
    const mediaRegex =
      /(?<!src=["'])(?<!href=["'])(\buploads\/insurance_files\/[^ ]+\.(?:png|jpe?g|gif|pdf|docx|txt)\b)/gi;

    let renderedHtml = htmlContent.replace(mediaRegex, (match) => {
      // Construct the full public URL for the backend server
      const publicUrl = `http://localhost:3000/${match.replace(/^\//, "")}`;

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

  /**
   * Fetches all existing insurance sections from the backend API.
   */
  const fetchSections = async () => {
    try {
      const res = await axios.get("/api/insurance-sections");
      if (Array.isArray(res.data)) {
        setSections(res.data);
      } else {
        console.warn(
          "API response for insurance sections was not an array:",
          res.data
        );
        setSections([]);
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
      setSections([]);
    }
  };

  // --- File Upload Handlers ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    if (file && file.type.startsWith("image/")) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      console.warn("Please select a file to upload first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await axios.post("/api/insurance-sections/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPath = res.data.filePath;
      setUploadedPath(newPath);
      copyToClipboard(newPath);

      console.info(
        `File uploaded! Path: ${newPath}. Path copied to clipboard.`
      );

      setUploadFile(null);
      setFilePreviewUrl(null);
    } catch (err) {
      console.error("Error uploading file:", err.response?.data || err.message);
      console.error(
        `Error uploading file. Status: ${
          err.response?.status || "Unknown"
        }. Check console for details.`
      );
    }
  };

  // --- CRUD Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for empty content (Quill default empty content is '<p><br></p>')
    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      console.error("Title and Content cannot be empty.");
      return;
    }

    const payload = { title, content };

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      let successMessage = "";

      if (editingId) {
        // Update existing section
        await axios.put(
          `/api/insurance-sections/${editingId}`,
          payload,
          config
        );
        successMessage = "Section updated successfully! 👍";
      } else {
        // Create new section
        await axios.post("/api/insurance-sections", payload, config);
        successMessage = "Section added successfully! 🎉";
      }

      // Reset form fields
      setTitle("");
      setContent("");
      setUploadedPath("");
      setEditingId(null);
      fetchSections();
      console.info(successMessage);
    } catch (err) {
      console.error("Error saving section:", err.response?.data || err.message);
      console.error(
        `Error saving section. Status: ${
          err.response?.status || "Unknown"
        }. Check console.`
      );
    }
  };

  const handleDelete = async (id) => {
    // Use a simple console message for confirmation instead of window.confirm/alert
    console.warn("Attempting to delete section:", id);

    try {
      await axios.delete(`/api/insurance-sections/${id}`);
      fetchSections();
      console.info("Section deleted successfully.");
    } catch (err) {
      console.error(
        "Error deleting section:",
        err.response?.data || err.message
      );
      console.error(
        `Error deleting section. Status: ${err.response?.status || "Unknown"}.`
      );
    }
  };

  const handleEdit = (section) => {
    setTitle(section.title);
    setContent(section.content);
    setEditingId(section.id);
    setUploadedPath("");
    setUploadFile(null);
    setFilePreviewUrl(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setUploadedPath("");
    setUploadFile(null);
    setFilePreviewUrl(null);
  };

  // --- Quill Configuration ---
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

  // --- Rendering ---
  return (
    <div className="admin-insurance-page">
      <NavbarAfterLogin />

      <div className="insurance-main">
        <h1>Admin Insurance Content Management</h1>

        {/* 1. File Upload Section (Static Files) */}
        <div className="admin-upload-section">
          <h2>1. Upload Inline Media/File</h2>
          <p className="upload-instructions">
            For large files or documents, upload them here, then copy the
            generated path and paste it into the editor below.
          </p>
          <form onSubmit={handleFileUpload} className="file-upload-form">
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*, .pdf, .docx, .txt"
            />
            <button type="submit" disabled={!uploadFile} className="upload-btn">
              📤 Upload & Get Path
            </button>
          </form>

          {uploadedPath && (
            <p className="upload-success-msg">
              ✅ Success! Paste this path into the Content:
              <code
                onClick={() => copyToClipboard(uploadedPath)}
                className="uploaded-path-code"
              >
                {uploadedPath}
              </code>
              <span className="copy-hint">(Click to copy)</span>
            </p>
          )}
        </div>
        <hr className="divider" />

        {/* 2. Form to Add/Edit Section (Rich Text Editor) */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>
            2. {editingId ? "Edit Existing Section" : "Create New Section"}
          </h2>

          {/* Local Preview Rendering */}
          {filePreviewUrl && uploadFile && (
            <div className="local-preview-container">
              <p className="preview-title">
                Local File Preview (for selection):
              </p>
              {uploadFile.type.startsWith("image/") ? (
                <img
                  src={filePreviewUrl}
                  alt="Selected Preview"
                  className="preview-image"
                />
              ) : (
                <p className="preview-filename">
                  File selected: {uploadFile.name}
                </p>
              )}
              <p className="preview-note">
                This preview is temporary. Upload the file and then paste the
                generated path below.
              </p>
            </div>
          )}

          <input
            type="text"
            placeholder="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="quill-editor-container">
            {/* FIX IMPLEMENTATION: Only render the editor once the component is mounted on the client side */}
            {isClient ? (
              <QuillWrapper
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Start typing your rich content here (bold, lists, images, tables...)"
              />
            ) : (
              <div className="quill-loading-placeholder">
                Loading Rich Text Editor...
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "💾 Update Section" : "➕ Add Section"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                ✖️ Cancel Edit
              </button>
            )}
          </div>
        </form>

        <hr className="divider" />

        {/* 3. Sections List with Preview */}
        <h2>All Existing Insurance Sections ({sections.length})</h2>
        <div className="sections-list">
          {sections.length === 0 ? (
            <p className="empty-list-message">
              No sections found. Add one above!
            </p>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="section-card">
                <h3>{section.title}</h3>
                <div
                  className="section-content-preview"
                  dangerouslySetInnerHTML={renderContentWithMedia(
                    section.content
                  )}
                />
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(section)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(section.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminInsurancePage;
