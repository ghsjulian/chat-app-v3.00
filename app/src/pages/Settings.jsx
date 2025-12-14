import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApp from "../store/useApp";

const Settings = () => {
    const { isSaving, saveSettings } = useApp();
    const navigate = useNavigate();
    const [isChangingPassword, setChangingPassword] = useState(false);
    const [userInfo, setUserInfo] = useState({
        avatar: null,
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        isSound: false,
        appTheme: "white",
        chatTheme: "white"
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

    const handleSave = async () => {
        await saveSettings(userInfo,navigate)
    };

    return (
        <div className="settings">
            <div className="settings-head">
                <span id="back" onClick={() => history.back()}>
                    {"<"}
                </span>
                <h3>Chat Settings</h3>
            </div>
            <div className="area">
                <p id="p-info">Account Information</p>
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
                            <button className="reset-btn">Reset Now</button>
                        </div>
                    </>
                )}
                <p id="p-info">App Layouts & Styles</p>

                <div className="row">
                    <p>Notification Sound</p>
                    <div className="box">
                        <input type="checkbox" />
                        <span>ON</span>
                    </div>
                </div>
                <div className="row">
                    <p> App Theme</p>
                    <select>
                        <option value="white">White</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="row">
                    <p>Chatbox Theme</p>
                    <select>
                        <option value="white">White</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="row">
                    <p>Account Controls</p>
                    <button id="logout-btn">Logout</button>
                </div>
                <div className="row">
                    <button onClick={handleSave} className="save-btn">
                        {isSaving && <div className="loader"></div>}
                        <span>
                            {isSaving ? "Saving..." : "Save Settings & Apply"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
