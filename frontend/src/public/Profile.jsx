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

  // Fetch user data on component mount
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

  const handleFileChange = (e) => setAvatar(e.target.files[0]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => formData.append(key, user[key]));
      if (avatar) formData.append("profile_image", avatar);

      await axios.put("http://localhost:3000/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("✅ Profile updated successfully!");
      const res = await axios.get("http://localhost:3000/api/profile", {
        withCredentials: true,
      });
      setUser(res.data);
      setAvatar(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile. Please try again.");
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
          {/* Header */}
          <div className="profile-header">
            <h2>Your Profile</h2>
          </div>

          {/* Avatar */}
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

          {/* Form */}
          <form className="profile-form" onSubmit={handleUpdate}>
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Age", name: "age", type: "number" },
              { label: "Occupation", name: "occupation", type: "text" },
              { label: "Financial Goal", name: "financial_goal", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "Contact", name: "contact", type: "text" },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={user[field.name] || ""}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  onChange={handleChange}
                />
              </div>
            ))}

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
