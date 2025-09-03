import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // icons
import "./ForgotPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => navigate("/"), 500); // redirect after short delay
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newPassword) {
      setError("Please enter your new password");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        { email, token, newPassword }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!token || !email) {
    return (
      <p className="invalid-link">Invalid or missing password reset link.</p>
    );
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h2 className="forgot-title">Reset Password</h2>
        <p className="forgot-subtitle">Enter your new password to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="forgot-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
          <button type="submit" className="forgot-btn">
            Reset Password
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
