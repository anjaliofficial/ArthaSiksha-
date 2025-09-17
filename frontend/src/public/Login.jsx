import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoWhite from "../assets/logoWhite.png";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post("http://localhost:3000/api/auth/login", formData, {
        withCredentials: true,
      });
      navigate("/homepage"); // redirect to homepage
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <img className="login-logo" src={logoWhite} alt="logo" />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="login-inputEmail"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="login-inputPassword"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Login Button */}
          <button type="submit" className="loginBtn">
            Log In
          </button>

          {/* Forgot Password */}
          <div className="login-forgotPassBtn">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>
        </form>

        {/* Error message */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {/* Redirect */}
        <p className="login-redirect">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="login-redirect-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
