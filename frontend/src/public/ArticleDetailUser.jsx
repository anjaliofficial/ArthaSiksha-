// src/pages/ArticleDetailUser.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./ArticleDetailUser.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const ArticleDetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize editor empty first
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Image],
    content: "", // start empty
  });

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/articles/getArticleById/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (res.ok) {
          setArticle(data.article);

          // Update editor content after article loads
          if (editor && data.article.body) {
            // If body is a JSON string, parse it
            let content = data.article.body;
            if (typeof content === "string") {
              try {
                content = JSON.parse(content);
              } catch (err) {
                // If parsing fails, wrap as simple paragraph
                content = {
                  type: "doc",
                  content: [{ type: "paragraph", content: [{ type: "text", text: content }] }],
                };
              }
            }
            editor.commands.setContent(content);
          }
        } else {
          alert(data.message || "Article not found");
          setArticle(null);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, editor]);

  if (loading) return <p className="loading">Loading article…</p>;
  if (!article) return <p className="empty">Article not found.</p>;

  return (
    <div className="article-detail-page">
      <Navbar />

      <div className="article-header">
        <button className="back-btn" onClick={() => navigate("/articles")}>
          ← Back to Articles
        </button>
        <h1 className="article-title">{article.title}</h1>
        {article.tags?.length > 0 && (
          <div className="article-tags">
            {article.tags.map((tag, i) => (
              <span key={i} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="article-body">
        {editor ? <EditorContent editor={editor} /> : <p>Loading content…</p>}
      </section>

      <Footer />
    </div>
  );
};

export default ArticleDetailUser;
