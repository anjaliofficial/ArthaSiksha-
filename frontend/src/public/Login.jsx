// Login.jsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "../assets/logoWhite.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true } // important for cookies
      );

      const { token, user } = response.data;
      console.log(user);
      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage({ text: "✅ Login successful!", type: "success" });

      setTimeout(() => {
        if (user.role === "admin"){
          navigate("/admindashboard");
        } else {
        navigate("/homepage"); // redirect after login
        }
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "❌ Invalid email or password!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Back button (optional, you can make it navigate back instead of href="#") */}
        <button
          type="button"
          className="login-backBtn"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackOutline />
        </button>

        <img className="login-logo" src={logoWhite} alt="logo" />

        <form onSubmit={handleSubmit}>
          <input
            className="login-inputEmail"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="login-inputPassword"
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="loginBtn" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {message.text && (
          <p
            style={{
              marginTop: "10px",
              color: message.type === "success" ? "green" : "red",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message.text}
          </p>
        )}

        {/* ✅ Fixed: no nested <a> tags */}
        <Link to="/forgotpassword" className="login-forgotPassBtn">
          Forgot Password
        </Link>

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