import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCog, FaBell } from "react-icons/fa";
import logo from "../assets/logoWhite.png";
import "./Profile.css";

const Profile = () => {
  const [avatar, setAvatar] = useState("👩‍💻");
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    age: "",
    occupation: "",
    financialGoal: "",
    language: "English",
    address: "",
    contact: "",
  });

  const USER_ID = 1;
  const API_URL = "http://localhost:3000/api/profile";

  // Map labels to state keys
  const fieldMap = {
    Username: "username",
    Email: "email",
    Age: "age",
    Occupation: "occupation",
    "Financial Goal": "financialGoal",
    Address: "address",
    Contact: "contact",
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/${USER_ID}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        if (data.profileImage) {
          setProfileImage(null);
          setAvatar(`http://localhost:3000${data.profileImage}`);
        }

        setUser({
          username: data.username || "",
          email: data.email || "",
          age: data.age !== null ? data.age : "",
          occupation: data.occupation || "",
          financialGoal: data.financialGoal || "",
          language: data.language || "English",
          address: data.address || "",
          contact: data.contact || "",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setAvatar(null);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => formData.append(key, user[key] || ""));
      if (profileImage instanceof File)
        formData.append("profileImage", profileImage);

      const res = await fetch(`${API_URL}/${USER_ID}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save profile");

      alert("Profile saved successfully!");
      setUser({
        username: data.username,
        email: data.email,
        age: data.age !== null ? data.age : "",
        occupation: data.occupation,
        financialGoal: data.financialGoal,
        language: data.language,
        address: data.address,
        contact: data.contact,
      });

      if (data.profileImage)
        setAvatar(`http://localhost:3000${data.profileImage}`);
      setProfileImage(null);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/features" className="nav-link">
              Features
            </Link>
          </li>
          <li>
            <Link to="/learn" className="nav-link">
              Learn
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="nav-link">
              <FaBell size={22} />
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link">
              <FaCog size={22} />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Hero */}
      <section className="profile-hero">
        <div className="avatar-section">
          <div className="avatar">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile"
                className="profile-img"
              />
            ) : avatar ? (
              <img src={avatar} alt="Profile" className="profile-img" />
            ) : (
              "👩‍💻"
            )}
          </div>

          {/* Avatar Options */}
          <div className="avatar-options">
            <button
              onClick={() => {
                setAvatar("👩‍💻");
                setProfileImage(null);
              }}
            >
              👩‍💻
            </button>
            <button
              onClick={() => {
                setAvatar("🧑‍🎓");
                setProfileImage(null);
              }}
            >
              🧑‍🎓
            </button>
            <button
              onClick={() => {
                setAvatar("🧑‍💼");
                setProfileImage(null);
              }}
            >
              🧑‍💼
            </button>
          </div>

          <div className="upload-photo">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        {/* User Info */}
        <div className="user-info">
          {Object.keys(fieldMap).map((label, idx) => {
            const key = fieldMap[label];
            return (
              <div className="input-box" key={idx}>
                <label>{label}</label>
                <input
                  type={key === "age" ? "number" : "text"}
                  value={user[key]}
                  onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                />
              </div>
            );
          })}

          <div className="input-box">
            <label>Language</label>
            <select
              value={user.language}
              onChange={(e) => setUser({ ...user, language: e.target.value })}
            >
              <option>English</option>
              <option>Nepali</option>
            </select>
          </div>

          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>
              Artha Shiksha is your platform for interactive financial
              education.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Subscribe</h4>
            <input type="email" placeholder="Your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
        <div className="footer-bottom-text">
          © 2025 Artha Shiksha. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Profile;
