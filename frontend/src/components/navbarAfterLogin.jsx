import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import logo from "../assets/logoWhite.png";
import axios from "axios";
import "./navbarAfterLogin.css";

const NavbarAfterLogin = ({ unreadCount }) => {
  const [user, setUser] = useState({ username: "Guest", profile_image: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true,
        });
        setUser({
          username: res.data.username || "User",
          profile_image: res.data.profile_image || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response && err.response.status === 401) navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const profileImageSrc = user.profile_image
    ? `http://localhost:3000/uploads/${user.profile_image}`
    : null;

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/homepage" className="logo">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="right">
        <ul>
          <li>
            <Link to="/modules">Modules</Link>
          </li>
          <li>
            <Link to="/articles">Articles</Link>
          </li>
          <li>
            <Link to="/quizzes">Quizzes</Link>
          </li>
          <li>
            <Link to="/leaderboards">Leaderboards</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
        <Link to="/notifications" className="notification-bell">
          <IoNotificationsCircleSharp />
          {unreadCount > 0 && (
            <span className="notif-count">{unreadCount}</span>
          )}
        </Link>
        <Link to="/profile">
          {profileImageSrc ? (
            <img
              src={profileImageSrc}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <span className="profile-image">👤</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAfterLogin;
