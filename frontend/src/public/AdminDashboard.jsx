import React, { useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaBook, FaChartBar, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logoWhite.png";

// Chart.js imports
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
import { Bar, Pie } from "react-chartjs-2";

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
  const [activeTab, setActiveTab] = useState("users");

  // Dummy data (replace with backend API later)
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "johndoe@email.com" },
    { id: 2, name: "Jane Smith", email: "janesmith@email.com" },
  ]);

  const [modules, setModules] = useState([
    { id: 1, title: "Budgeting Basics" },
    { id: 2, title: "Investing 101" },
  ]);

  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      user: "John Doe",
      message: "Love the platform!",
      status: "Pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      message: "Add more quizzes.",
      status: "Pending",
    },
  ]);

  const analytics = {
    totalUsers: 120,
    activeUsers: 95,
    completedModules: 300,
    moduleCompletion: {
      labels: ["Budgeting", "Investing", "Saving", "Loans", "Tax"],
      data: [80, 60, 50, 30, 40],
    },
    userCategories: {
      labels: ["Student", "Professional", "Entrepreneur", "Retired"],
      data: [40, 35, 25, 20],
    },
  };

  // Chart Data
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
        backgroundColor: ["#B5F042", "#9acc38", "#27ae60", "#6ab04c"],
      },
    ],
  };

  // Feedback Actions
  const handleReply = (id) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      alert(`Reply sent for feedback ID ${id}: "${reply}"`);
      // Here you can also update the backend
    }
  };

  const handleResolve = (id) => {
    setFeedbacks(
      feedbacks.map((f) => (f.id === id ? { ...f, status: "Resolved" } : f))
    );
  };

  return (
    <div className="admin-dashboard-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li onClick={() => setActiveTab("users")}>Users</li>
          <li onClick={() => setActiveTab("modules")}>Modules</li>
          <li onClick={() => setActiveTab("analytics")}>Analytics</li>
          <li onClick={() => setActiveTab("feedback")}>Feedback</li>
        </ul>
      </nav>

      {/* Overview Cards */}
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

      {/* Tab Content */}
      <section className="tab-content">
        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="admin-section">
            <h2>User Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === "modules" && (
          <div className="admin-section">
            <h2>Module Management</h2>
            <ul className="module-list">
              {modules.map((m) => (
                <li key={m.id}>
                  {m.title} <button className="edit-btn">Edit</button>{" "}
                  <button className="delete-btn">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analytics Tab */}
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

        {/* Feedback Tab */}
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
                    <td>{f.status}</td>
                    <td>
                      <button
                        className="reply-btn"
                        onClick={() => handleReply(f.id)}
                      >
                        Reply
                      </button>
                      <button
                        className="resolve-btn"
                        onClick={() => handleResolve(f.id)}
                      >
                        Mark Resolved
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
