import React from "react";

const VerifyOtp = () => {
    return (
        <div className="settings">
            <h3>Chat Settings</h3>
            <div className="area">
                <p id="p-info">Account Information</p>
                <div className="row">
                    <p>Your Profile Image</p>
                    <div className="profile-img">
                        <img src="/ghs.png" />
                        <label htmlFor="img">Change</label>
                        <input id="img" type="file" multiple hidden />
                    </div>
                </div>
                <div className="row">
                    <p>User Name</p>
                    <input type="text" placeholder="Enter Full Name" />
                </div>
                <div className="row">
                    <p>Email Address</p>
                    <input type="email" placeholder="Enter Email Address" />
                </div>
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
            </div>
        </div>
    );
};

export default VerifyOtp;
