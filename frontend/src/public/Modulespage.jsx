// src/pages/ModulesPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ModulesPage.css";

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const url = query
          ? `http://localhost:3000/api/modules/searchModules?query=${encodeURIComponent(query)}`
          : `http://localhost:3000/api/modules/getAllModules`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.status === 401) {
          // not authenticated
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (res.ok) {
          // endpoint returns { modules: [...] } (as admin did)
          setModules(data.modules || []);
        } else {
          console.warn("Failed to load modules:", data.message);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [query, navigate]);

  return (
    <div className="modules-page">
      <header className="modules-header">
        <h1>All Modules</h1>
        <div className="modules-controls">
          <input
            type="search"
            placeholder="Search modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="modules-search"
          />
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading modules…</p>
      ) : modules.length === 0 ? (
        <p className="empty">No modules found.</p>
      ) : (
        <ul className="module-list">
          {modules.map((m) => (
            <li key={m.id} className="module-card">
              <div className="module-card-left">
                <h3 className="module-title">
                  <Link to={`/modules/${m.id}`}>{m.title}</Link>
                </h3>
                <p className="module-desc">{m.description}</p>
              </div>

              <div className="module-card-right">
                <Link to={`/modules/${m.id}`} className="view-btn">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModulesPage;
