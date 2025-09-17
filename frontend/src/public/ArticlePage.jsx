import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import logo from "../assets/logoWhite.png";
import "./ArticlePage.css";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Loading article...</p>",
    editable: false, // read-only
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/articles/getArticleById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setArticle(data.article);
          editor?.commands.setContent(data.article.body);
        } else {
          alert(data.message || "Article not found");
          navigate("/admin/articles");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [id, editor, navigate]);

  if (!article) return <p className="loading">Loading...</p>;

  return (
    <div className="article-page">
      {/* Header */}
      <header className="article-header">
        <Link to="/admin">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <h2>{article.title}</h2>
      </header>

      {/* Article Content */}
      <main className="article-content">
        {article.tags?.length > 0 && (
          <p className="article-tags">
            Tags: {article.tags.join(", ")}
          </p>
        )}
        <div className="editor-container">
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="article-footer">
        <p>&copy; 2025 My Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default ArticlePage;
