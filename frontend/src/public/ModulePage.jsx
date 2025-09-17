import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import logo from "../assets/logoWhite.png";
import "./ModulePage.css";

const ModulePage = () => {
  const { id } = useParams(); // get module id from URL
  const navigate = useNavigate();
  const [module, setModule] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Loading module...</p>",
    editable: false, // read-only
  });

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/modules/getModuleById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setModule(data.module);
          editor?.commands.setContent(data.module.content);
        } else {
          alert(data.message || "Module not found");
          navigate("/admin/modules");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchModule();
  }, [id, editor, navigate]);

  if (!module) return <p className="loading">Loading...</p>;

  return (
    <div className="module-page">
      {/* Header */}
      <header className="module-header">
        <Link to="/admin">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <h2>{module.title}</h2>
      </header>

      {/* Module Content */}
      <main className="module-content">
        <p className="module-description">{module.description}</p>
        <div className="editor-container">
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="module-footer">
        <p>&copy; 2025 My Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default ModulePage;
