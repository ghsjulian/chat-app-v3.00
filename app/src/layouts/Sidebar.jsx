import React from "react";
import { NavLink } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import useApp from "../store/useApp"


const Sidebar = () => {
    const {isMenuActive} = useApp()
    
    return (
        <aside className={isMenuActive ? "sidebar active-menu" : "sidebar"}>
            <div className="side-top">
                <div className="heading">
                    <h3>Chats</h3>
                    <div className="icon">
                        <IoSettingsOutline size={24} />
                    </div>
                </div>
                <div className="search">
                    <input type="text" placeholder="Search users..." />
                    <IoSearchOutline size={24} />
                </div>
            </div>
            <div className="users-list">
                <NavLink className="" to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
                <NavLink to="#">
                    <div className="left">
                        <img src="./ghs.png" />
                        <div className="name">
                            <span>Ghs Julian</span>
                            <p>This is a test message</p>
                        </div>
                    </div>
                    <div className="right">
                        <time>12:45 PM</time>
                    </div>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
