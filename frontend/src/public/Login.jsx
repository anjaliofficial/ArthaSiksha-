// Login.jsx
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <a className="login-backBtn" href="#">
          <IoArrowBackOutline />
        </a>
        <img className="login-logo" src={logoWhite} alt="logo" />

        <input className="login-inputEmail" type="email" placeholder="Email" />
        <input
          className="login-inputPassword"
          type="password"
          placeholder="********"
        />

        <button className="loginBtn">Log In</button>

        <a className="login-forgotPassBtn" href="#">
          <Link to="/forgotpassword" className="forgot-password-link">
            {" "}
            Forgot Password
          </Link>
        </a>

        <p className="login-redirect">
          Don’t have an account?{" "}
          <Link to="/signup" className="login-redirect-link">
            Sign Up
          </Link>
        </p>

        <div className="login-social-icons">
          <a href="#" className="login-google-icon">
            <FcGoogle />
          </a>
          <a href="#" className="login-facebook-icon">
            <FaFacebook />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
