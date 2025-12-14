import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/login.style.css";
import useAuth from "../store/useAuth";

const Login = () => {
    const { isLoggingIn, loginNow } = useAuth();
    const navigate = useNavigate();
    const msgRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const showMessage = (msg, type) => {
        if (type) {
            msgRef.current.textContent = msg;
            msgRef.current.classList.add("success");
        } else {
            msgRef.current.textContent = msg;
            msgRef.current.classList.add("error");
        }
        setTimeout(() => {
            msgRef.current.textContent = "";
            msgRef.current.removeAttribute("class");
        }, 2500);
    };
    const checkValidation = () => {
        const trimmedEmail = email?.trim();
        const trimmedPassword = password?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            showMessage("User email is required", false);
            return false;
        } else if (!emailRegex.test(trimmedEmail)) {
            showMessage("Enter a valid email address", false);
            return false;
        } else if (!trimmedPassword) {
            showMessage("User password is required", false);
            return false;
        } else if (trimmedPassword.length < 6) {
            showMessage("Password must be at least 6 characters long", false);
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!checkValidation()) return;
        console.log("....");
        await loginNow({ email, password }, showMessage, navigate);
    };
    return (
        <div className="full-page">
            <div className="form">
                <h3>Login Now</h3>
                <span ref={msgRef} id="msg"></span>
                <input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter User Email"
                />
                <input
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter User Password"
                />
                <button onClick={handleLogin} 
                disabled={isLoggingIn}
                className="login-btn">
                    {isLoggingIn && <div className="loader"></div>}
                    <p1>{isLoggingIn ? "Please Wait..." : "Sign In"}</p1>
                </button>
                <p>
                    Don't Have An Account?{" "}
                    <NavLink to="/signup">Sign up</NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
