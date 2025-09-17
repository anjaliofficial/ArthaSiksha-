import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.post("http://localhost:3000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage("✅ Registered successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Back Button */}
        <Link className="signup-backBtn" to="/">
          <IoArrowBackOutline />
        </Link>

        {/* Logo */}
        <img className="signup-logo" src={logoWhite} alt="logo" />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label className="signup-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="signup-input"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="signup-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="signup-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="signup-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="signup-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="signup-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className="signup-input"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signupBtn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <p style={{ color: "green", marginTop: "12px" }}>{message}</p>
        )}
        {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}

        {/* Redirect */}
        <p className="signup-redirect">
          Already have an account?{" "}
          <Link to="/login" className="signup-redirect-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
