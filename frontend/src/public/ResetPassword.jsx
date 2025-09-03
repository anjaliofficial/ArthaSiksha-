import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css"; // reuse styles

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

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

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h2 className="forgot-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="forgot-inputEmail"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="forgotBtn" type="submit">
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
