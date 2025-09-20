import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay, FaChevronRight, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";

import NavbarAfterLogin from "../components/navbarAfterLogin.jsx";
import Footer from "../components/footer";
import "./HomePage.css";

// Connect to Socket.io server
const socket = io("http://localhost:3000");

const HomePage = () => {
  const [user, setUser] = useState({
    id: null,
    username: "Guest",
    profile_image: null,
  });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUser({
          id: res.data.id, // store id for notifications
          username: res.data.username || "User",
          profile_image: res.data.profile_image || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch notifications and join socket room
  useEffect(() => {
    if (!user.id) return; // wait until user is fetched

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/notification/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Sort by newest first and take top 3
        const latestThree = (res.data.notifications || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setNotifications(latestThree);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    // Join socket room for live updates
    socket.emit("join", user.id);

    socket.on("new_notification", (newNote) => {
      setNotifications((prev) => {
        const updated = [newNote, ...prev];
        return updated.slice(0, 3); // keep only latest 3
      });
    });

    return () => socket.off("new_notification");
  }, [user.id]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="whole-home-page">
      <NavbarAfterLogin unreadCount={unreadCount} />

      <div className="main-content">
        <div className="line"></div>

        {/* Top Section */}
        <div className="top-three">
          <div className="welcoming">
            <h1 className="welcomeText">Welcome, {user.username}</h1>
            <p className="modules-text">You've completed 3/10 modules</p>
            <div className="progress-container">
              <div className="progress-bar">70%</div>
            </div>

            <div className="two-sides">
              <div className="mission">
                <h3 className="mission-header">Today's Mission</h3>
                <div className="video-mission">
                  <FaPlay />
                </div>
              </div>
              <div className="stats">
                <h3 className="stats-header">Quick Stats</h3>
                <div className="points-streak">
                  <div className="pointsCol">
                    <h6>Points</h6>
                    <p>250</p>
                  </div>
                  <div className="line-stats">|</div>
                  <div className="streakCol">
                    <h6>Streak</h6>
                    <p>5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Lessons */}
          <div className="recom-lessons">
            <h2>Recommended Lessons</h2>
            <Link to="/lessons/1" className="lessons">
              <h6>How to budget pocket money?</h6>
              <FaChevronRight />
            </Link>
            <Link to="/lessons/2" className="lessons">
              <h6>Saving for goals</h6>
              <FaChevronRight />
            </Link>
            <Link to="/lessons/3" className="lessons">
              <h6>Understanding needs vs wants</h6>
              <FaChevronRight />
            </Link>
          </div>

          {/* Notifications Preview */}
          <div className="notification-contents">
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <Link to="/notifications" key={note.id} className="not-content">
                  <p>{note.message}</p>
                </Link>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="btm-two">
          {/* Leaderboard */}
          <div className="leaderboard-preview">
            <h2>Leaderboard</h2>
            <div className="leads">
              <p>1. Anna Roberts</p>
              <p>500 XP</p>
              <p>🏆 1st</p>
            </div>
            <div className="leads">
              <p>2. Cubby</p>
              <p>450 XP</p>
              <p>🏆 2nd</p>
            </div>
            <div className="leads">
              <p>3. Appu Cutiee</p>
              <p>430 XP</p>
              <p>🏆 3rd</p>
            </div>
            <div className="empty-btn">
              <div className="area"></div>
              <div className="full-leads-btn">
                <Link to="/leaderboards">
                  <button>
                    See Full Leaderboard <FaArrowRight />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Events & Badges */}
          <div className="events-tips">
            <div className="events">
              <h2>Upcoming Events</h2>
              <Link to="/events/quiz" className="quiz-thing">
                <h4>Weekly Quiz</h4>
                <p>2 days</p>
              </Link>
              <Link to="/events/workshop" className="quiz-thing">
                <h4>Finance Workshop</h4>
                <p>5 days</p>
              </Link>
            </div>

            <div className="tip-line"></div>
            <div className="again-two">
              <div className="finance-tip">
                <h2>Finance Tip</h2>
                <p>Set a budget for your weekly expenses</p>
              </div>
              <div className="badges">
                <h2>Badges</h2>
                <div className="more-badges">
                  <Link to="/badges" className="badgeArea">
                    <img
                      src="/placeholder-badge.png"
                      alt="badge-img"
                      className="image-badges"
                    />
                    <p>Budget Boss</p>
                  </Link>
                  <Link to="/badges" className="badgeArea">
                    <img
                      src="/placeholder-badge.png"
                      alt="badge-img"
                      className="image-badges"
                    />
                    <p>Savings Star</p>
                  </Link>
                </div>
                <Link to="/badges">+ See all badges</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
