import logoWhite from '../assets/logoWhite.png';
import { IoArrowBackOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import './Login.css';

const Login = () => {
    return(
        <div className="whole-page">
            <div className="login-container">
                <a className='backBtn' href="#"><IoArrowBackOutline /></a>
                <img className='company-logo' src={logoWhite} alt="logo" />
                <input className='inputEmail' type="email" placeholder='email' />
                <input className='inputPassword' type="password" placeholder='********'/>
                <button className='loginBtn'>Log In</button>
                <a className='forgotPassBtn' href="#">Forgot Password?</a>
                <div className='social-icons'>
                    <a href="#" className='google-icon'><FcGoogle /></a>
                    <a href="#" className='facebook-icon'><FaFacebook /></a>
                </div>
            </div>
        </div>
    );
};

export default Login;