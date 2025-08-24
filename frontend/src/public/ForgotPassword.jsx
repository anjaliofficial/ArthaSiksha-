// ForgotPassword.jsx
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
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

        <input className="forgot-inputEmail" type="email" placeholder="Email" />
        <button className="forgotBtn">Send Reset Link</button>

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
