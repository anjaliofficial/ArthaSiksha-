import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="forgot-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="forgot-btn">
            Send Reset Link
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="forgot-redirect">
          Back to <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
