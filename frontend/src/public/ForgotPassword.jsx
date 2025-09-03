import { useState } from "react";
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        { email }
      );

      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <Link to="/" className="forgot-backBtn">
          <IoArrowBackOutline />
        </Link>
        <img className="forgot-logo" src={logoWhite} alt="logo" />

        <h2 className="forgot-title">Forgot Password?</h2>
        <p className="forgot-subtitle">
          Enter your email below and we’ll send you instructions to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="forgot-inputEmail"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="forgotBtn" type="submit">
            Send Reset Link
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="forgot-redirect">
          Remember your password?{" "}
          <Link to="/" className="forgot-redirect-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
