// src/pages/ArticlesPageUser.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./ArticlesPageUser.css";

const ArticlesPageUser = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const url = query
                    ? `http://localhost:3000/api/articles/searchArticles?query=${encodeURIComponent(
                        query
                    )}`
                    : `http://localhost:3000/api/articles/getAllArticles`;

                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (res.status === 401) {
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                if (res.ok) {
                    setArticles(data.articles || []);
                } else {
                    setArticles([]);
                }
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [query, navigate]);

    return (
        <div className="articles-page">
            <Navbar />

            <header className="articles-header">
  <div className="articles-header-left">
    <button
      className="back-home-btn"
      onClick={() => navigate("/homepage")}
    >
      ← Home
    </button>
    <h1 className="articles-title">All Articles</h1>
  </div>

  <div className="articles-controls">
    <input
      type="search"
      placeholder="Search articles..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="articles-search"
    />
  </div>
</header>


            {loading ? (
                <p className="loading">Loading articles…</p>
            ) : articles.length === 0 ? (
                <p className="empty">No articles found.</p>
            ) : (
                <ul className="article-list">
                    {articles.map((a) => (
                        <li key={a.id} className="article-card">
                            <div className="article-card-left">
                                <h3 className="article-title">
                                    <Link to={`/articles/${a.id}`}>{a.title}</Link>
                                </h3>

                                {a.tags?.length > 0 && (
                                    <div className="article-tags">
                                        {a.tags.map((tag, i) => (
                                            <span key={i} className="tag">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="article-card-right">
                                <Link to={`/articles/${a.id}`} className="view-btn">
                                    Read More
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Footer />
        </div>
    );
};

export default ArticlesPageUser;
