import React, { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/login.style.css";
import useAuth from "../store/useAuth";

const ResetPassword = () => {
    const { resetPassword, isReseting } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const msgRef = useRef(null);
    const navigate = useNavigate();
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

    return (
        <div className="full-page">
            <div className="form">
                <h3>Create A New Password</h3>
                <span ref={msgRef} id="msg"></span>
                <input
                    type="password"
                    onChange={e => setNewPassword(e.target.value)}
                    value={newPassword}
                    placeholder="Enter New Password"
                />
                <input
                    type="password"
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    value={confirmNewPassword}
                    placeholder="Confirm New Password"
                />
                <button
                    onClick={() => {
                        if (
                            !newPassword ||
                            (newPassword.trim() === "" &&
                                !confirmNewPassword) ||
                            confirmNewPassword.trim() === ""
                        ) {
                            showMessage("All fields are required", false);
                            return;
                        } else if (newPassword.trim().length < 6) {
                            showMessage(
                                "Password at least 6 characters",
                                false
                            );
                            return;
                        } else if (
                            newPassword.trim() !== confirmNewPassword.trim()
                        ) {
                            showMessage("Password didn't match", false);
                            return;
                        }
                        resetPassword({newPassword,confirmNewPassword}, showMessage, navigate);
                    }}
                    disabled={isReseting}
                    className="login-btn"
                >
                    {isReseting && <div className="loader"></div>}
                    <p1>{isReseting ? "Processing..." : "Change Now"}</p1>
                </button>
                <p>
                    Don't have account? <NavLink to="/signup">Signup</NavLink>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
