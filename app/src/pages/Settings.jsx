import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useApp from "../store/useApp";
import useAuth from "../store/useAuth";

const Settings = () => {
    const {
        user,
        userLogout,
        isLogout,
        deleteAccount,
        isDeleting,
        resendOtp,
        isResending
    } = useAuth();
    const { chatSettings, isSaving, saveSettings } = useApp();
    const navigate = useNavigate();
    const msgRef = useRef(null);
    const areaRef = useRef(null);
    const [isChangingPassword, setChangingPassword] = useState(false);
    const [isDeleteClick, setDeleteClick] = useState(false);
    const [userInfo, setUserInfo] = useState({
        avatar: user?.avatar?.img_url || null,
        name: user?.name || "",
        email: user?.email || "",
        oldPassword: "",
        newPassword: "",
        isChangingPassword,
        isSound: chatSettings?.isSound,
        appTheme: chatSettings?.appTheme || "white",
        chatTheme: chatSettings?.chatTheme || "white"
    });
    const createBase64 = async file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };
    const handleFile = async e => {
        let file = e.target.files[0];
        if (!file) return;
        const base64 = await createBase64(file);
        setUserInfo(prev => ({
            ...prev,
            ["avatar"]: base64
        }));
    };
    const showMessage = (msg, type) => {
        if (type) {
            msgRef.current.textContent = msg;
            msgRef.current.classList.add("success");
        } else {
            msgRef.current.textContent = msg;
            msgRef.current.classList.add("error");
        }
        areaRef.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setTimeout(() => {
            msgRef.current.textContent = "";
            msgRef.current.removeAttribute("class");
        }, 2500);
    };
    const checkValidation = () => {
        const trimmedName = userInfo?.name?.trim();
        const trimmedEmail = userInfo?.email?.trim();
        const trimmedOldPassword = userInfo?.oldPassword?.trim();
        const trimmedNewPassword = userInfo?.newPassword?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userInfo?.avatar || userInfo?.avatar === null) {
            showMessage("User avatar is required", false);
            return false;
        } else if (!trimmedName) {
            showMessage("User name is required", false);
            return false;
        } else if (!trimmedEmail) {
            showMessage("User email is required", false);
            return false;
        } else if (!emailRegex.test(trimmedEmail)) {
            showMessage("Enter a valid email address", false);
            return false;
        }
        if (isChangingPassword) {
            if (!trimmedOldPassword) {
                showMessage("Old password is required", false);
                return false;
            } else if (trimmedOldPassword?.length < 6) {
                showMessage(
                    "Old password must be at least 6 characters",
                    false
                );
                return false;
            } else if (!trimmedNewPassword) {
                showMessage("New password is required", false);
                return false;
            } else if (trimmedNewPassword?.length < 6) {
                showMessage(
                    "New password must be at least 6 characters",
                    false
                );
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!checkValidation()) return;
        await saveSettings(userInfo, showMessage, navigate);
    };

    return (
        <div ref={areaRef} className="settings">
            <div className="settings-head">
                <span id="back" onClick={() => history.back()}>
                    <IoArrowBackCircleOutline size={28} />
                </span>
                <h3>Chat Settings</h3>
            </div>
            <div className="area">
                <span ref={msgRef} id="msg"></span>
                <p id="p-info">Account Information</p>
                <div className="row">
                    <p>Account Verification S.</p>
                    <button
                        className={
                            user?.isVerified ? "verified" : "not-verified"
                        }
                    >
                        {user?.isVerified ? "Verified" : "Not Verified"}
                    </button>
                </div>
                <div className="row">
                    <p>Your Profile Image</p>
                    <div className="profile-img">
                        <img
                            src={userInfo.avatar ? userInfo.avatar : "/ghs.png"}
                        />
                        <label htmlFor="img">Change</label>
                        <input
                            onChange={handleFile}
                            id="img"
                            type="file"
                            multiple
                            hidden
                        />
                    </div>
                </div>
                <div className="row">
                    <p>User Name</p>
                    <input
                        onChange={e => {
                            setUserInfo(prev => ({
                                ...prev,
                                ["name"]: e.target.value
                            }));
                        }}
                        value={userInfo.name}
                        type="text"
                        placeholder="Enter Full Name"
                    />
                </div>
                <div className="row">
                    <p>Email Address</p>
                    <input
                        onChange={e => {
                            setUserInfo(prev => ({
                                ...prev,
                                ["email"]: e.target.value
                            }));
                        }}
                        value={userInfo.email}
                        type="email"
                        placeholder="Enter Email Address"
                    />
                </div>
                <div className="row">
                    <p>Change Your Password</p>
                    <button
                        onClick={() => setChangingPassword(!isChangingPassword)}
                        className="info-btn"
                    >
                        Change
                    </button>
                </div>
                {isChangingPassword && (
                    <>
                        <div className="row">
                            <p>Old Password</p>
                            <input
                                onChange={e => {
                                    setUserInfo(prev => ({
                                        ...prev,
                                        ["oldPassword"]: e.target.value
                                    }));
                                }}
                                value={userInfo.oldPassword}
                                type="password"
                                placeholder="Enter Old Password"
                            />
                        </div>
                        <div className="row">
                            <p>New Password</p>
                            <input
                                onChange={e => {
                                    setUserInfo(prev => ({
                                        ...prev,
                                        ["newPassword"]: e.target.value
                                    }));
                                }}
                                value={userInfo.newPassword}
                                type="password"
                                placeholder="Enter New Password"
                            />
                        </div>
                        <div className="row">
                            <p id="info">Forgot Password ? </p>
                            <button
                                disabled={isResending}
                                onClick={async () => {
                                    await resendOtp(showMessage);
                                    setTimeout(() => {
                                        navigate("/verify-otp");
                                    }, 2000);
                                }}
                                className="reset-btn"
                            >
                                {isResending ? "Please Wait..." : "Reset Now"}
                            </button>
                        </div>
                    </>
                )}
                <p id="p-info">App Layouts & Styles</p>

                <div className="row">
                    <p>Notification Sound</p>
                    <div className="box">
                        <input
                            onChange={() => {
                                setUserInfo(prev => ({
                                    ...prev,
                                    ["isSound"]: !userInfo.isSound
                                }));
                            }}
                            checked={userInfo.isSound}
                            type="checkbox"
                        />
                        <span>{userInfo.isSound ? "ON" : "OFF"}</span>
                    </div>
                </div>
                <div className="row">
                    <p> App Theme</p>
                    <select
                        onChange={e => {
                            setUserInfo(prev => ({
                                ...prev,
                                ["appTheme"]: e.target.value
                            }));
                        }}
                        value={userInfo.appTheme}
                    >
                        <option value="white">White</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="row">
                    <p>Chatbox Theme</p>
                    <select
                        onChange={e => {
                            setUserInfo(prev => ({
                                ...prev,
                                ["chatTheme"]: e.target.value
                            }));
                        }}
                        value={userInfo.chatTheme}
                    >
                        <option value="white">White</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="row">
                    <p>Account Controls</p>
                    <button onClick={userLogout} id="logout-btn">
                        {isLogout && <div className="loader"></div>}
                        <span>{isLogout ? "Processing..." : "Logout"}</span>
                    </button>
                </div>
                <div className="row">
                    <p>Account Ownership</p>
                    <button
                        onClick={() => {
                            setDeleteClick(true);
                        }}
                        id="delete-btn"
                    >
                        <span>Delete Account</span>
                    </button>
                </div>
                <br />
                <div className="row">
                    <button
                        disabled={isSaving}
                        onClick={handleSave}
                        className="save-btn"
                    >
                        {isSaving && <div className="loader"></div>}
                        <span>
                            {isSaving ? "Saving..." : "Save Settings & Apply"}
                        </span>
                    </button>
                </div>
                {isDeleteClick && (
                    <div className="pop">
                        <p>Are you confirm?</p>
                        <small>
                            The account can't be recovered again if you delete
                            once
                        </small>
                        <div className="action">
                            <button onClick={deleteAccount} id="yes">
                                Yes
                            </button>
                            <button
                                onClick={() => {
                                    setDeleteClick(false);
                                }}
                                id="no"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
