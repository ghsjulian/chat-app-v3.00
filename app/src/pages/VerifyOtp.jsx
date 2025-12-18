import React, { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/login.style.css";
import useAuth from "../store/useAuth";

const VerifyOtp = () => {
    const { isVerifying, isResending, resendOtp, verifyOtp } = useAuth();
    const [otp, setOtp] = useState("");
    const [remaing, setRemaining] = useState(60);
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
    useEffect(() => {
        if(remaing === 0) return 
        setTimeout(() => {
            setRemaining(remaing - 1);
        }, 1000);
    }, [remaing]);

    return (
        <div className="full-page">
            <div className="form">
                <h3>Verify Your Account</h3>
                <p id="info">
                    A verification code has been sent to your email. Please
                    check your email, if you can't find the otp in your email
                    then open the spam box in your email. Copy the OTP and paste
                    it here.
                </p>
                <span ref={msgRef} id="msg"></span>
                <input
                    type="number"
                    onChange={e => setOtp(e.target.value)}
                    value={otp}
                    placeholder="Enter OTP Value"
                />
                <button
                    onClick={async() => {
                        if (!otp || otp.trim() === "") {
                            showMessage("OTP is required", false);
                            return;
                        }
                        let isSent = await verifyOtp(otp, showMessage);
                        if(isSent) navigate("/")
                    }}
                    disabled={isVerifying}
                    className="login-btn"
                >
                    {isVerifying && <div className="loader"></div>}
                    <p1>{isVerifying ? "Processing..." : "Verify OTP"}</p1>
                </button>
                <p>
                    Request for new OTP{" "}
                    {remaing > 0 && !isResending ? (
                        <NavLink to="#">{remaing + "S"}</NavLink>
                    ) : (
                        <NavLink
                            to="#"
                            disabled={isResending}
                            onClick={e => {
                                e.preventDefault();
                                if (remaing > 1) return;
                                resendOtp(showMessage);
                                setRemaining(60);
                            }}
                        >
                            {isResending ? "Please Wait..." : "  Resend"}
                        </NavLink>
                    )}
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
