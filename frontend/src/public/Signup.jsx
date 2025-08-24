// Signup.jsx
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <a className="signup-backBtn" href="#">
          <IoArrowBackOutline />
        </a>
        <img className="signup-logo" src={logoWhite} alt="logo" />

        <input className="signup-input" type="text" placeholder="Full Name" />
        <input className="signup-input" type="email" placeholder="Email" />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Confirm Password"
        />
        <input className="signup-input" type="text" placeholder="Address" />
        <input
          className="signup-input"
          type="tel"
          placeholder="Contact Number"
        />

        <button className="signupBtn">Sign Up</button>

        <p className="signup-redirect">
          Already have an account?{" "}
          <Link to="/login" className="signup-redirect-link">
            Log In
          </Link>
        </p>

        <div className="signup-social-icons">
          <a href="#" className="signup-google-icon">
            <FcGoogle />
          </a>
          <a href="#" className="signup-facebook-icon">
            <FaFacebook />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
