import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../components/footer";
import Navbar from "../components/navbarAfterLogin";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    age: "",
    occupation: "",
    financial_goal: "",
    address: "",
    contact: "",
    profile_image: null,
  });
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("age", user.age);
      formData.append("occupation", user.occupation);
      formData.append("financial_goal", user.financial_goal);
      formData.append("address", user.address);
      formData.append("contact", user.contact);
      if (avatar) {
        formData.append("profile_image", avatar);
      }

      await axios.put("http://localhost:3000/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Profile updated successfully!");
      const res = await axios.get("http://localhost:3000/api/profile", {
        withCredentials: true,
      });
      setUser(res.data);
      setAvatar(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const profileImageSrc =
    user.profile_image && user.profile_image !== ""
      ? `http://localhost:3000/uploads/${user.profile_image}`
      : null;

  return (
    <div className="whole-page-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-header">
            <h2>Your Profile</h2>
          </div>
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="profile-avatar">
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt="Profile"
                  className="current-profile-pic"
                />
              ) : (
                <div className="placeholder-avatar">👤</div>
              )}
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={user.age || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={user.occupation || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Financial Goal</label>
              <input
                type="text"
                name="financial_goal"
                value={user.financial_goal || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={user.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={user.contact || ""}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="update-btn">
              Update Profile
            </button>
          </form>
          <div className="back-link">
            <Link to="/homepage">← Back to Dashboard</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
