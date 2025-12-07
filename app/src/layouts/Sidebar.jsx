import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import useApp from "../store/useApp";
import User from "../components/User";

const Sidebar = () => {
    const { isMenuActive, setPath,path } = useApp();
    const location = useLocation();
    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    return (
        <aside className={path === "/" ? "sidebar active-menu" : "sidebar"}>
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
                {/*Here I will apply the logic,
                like render the users and search users also */}
                <User />
            </div>
        </aside>
    );
};

export default Sidebar;
