import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/login.style.css";
import useAuth from "../store/useAuth";
import { IoCloudUploadOutline } from "react-icons/io5";

const Login = () => {
    const { isSiginingUp, signupNow } = useAuth();
    const navigate = useNavigate();
    const msgRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [base64, setBase64] = useState(null);
    const [name, setName] = useState("");
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

        if (!avatar || avatar === null) {
            showMessage("User avatar is required", false);
            return false;
        }
        if (!name || name.trim() === "") {
            showMessage("User name is required", false);
            return false;
        } else if (!trimmedEmail) {
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
    const createBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
    const handleAvatar = async e => {
        let file = e.target.files[0];
        if (!file || file === null) return;
        setAvatar(file);
        setBase64(await(createBase64(file)))
    };

    const handleLogin = async () => {
        if (!checkValidation()) return;
        console.log("....");
        await signupNow(
            { avatar:base64, name, email, password },
            showMessage,
            navigate
        );
    };
    return (
        <div className="full-page">
            <div className="form">
                <h3>Create Account</h3>
                <div className="user-avatar">
                    <label htmlFor="avatar">
                        <IoCloudUploadOutline size={24} />
                    </label>
                    <input
                        onChange={handleAvatar}
                        type="file"
                        id="avatar"
                        multiple
                        hidden
                    />
                    {avatar && <img src={URL.createObjectURL(avatar)} />}
                </div>
                <span ref={msgRef} id="msg"></span>
                <input
                    type="text"
                    onChange={e => setName(e.target.value)}
                    value={name}
                    placeholder="Enter User Name"
                />
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
                <button
                    onClick={handleLogin}
                    disabled={isSiginingUp}
                    className="login-btn"
                >
                    {isSiginingUp && <div className="loader"></div>}
                    <p1>{isSiginingUp ? "Please Wait..." : "Sign Up"}</p1>
                </button>
                <p>
                    Already Have Account? <NavLink to="/login">Login</NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
