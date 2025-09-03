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
    address: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // success/error message
  const [error, setError] = useState(""); // error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage("✅ Successfully registered! Redirecting to login...");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        contact: "",
      });

      // Redirect to login after 2 sec
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <a className="signup-backBtn" href="#">
          <IoArrowBackOutline />
        </a>
        <img className="signup-logo" src={logoWhite} alt="logo" />

        <form onSubmit={handleSubmit}>
          <input
            className="signup-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="signup-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="signup-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="signup-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            className="signup-input"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            className="signup-input"
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />

          <button className="signupBtn" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Show success or error message */}
        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
        )}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

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
