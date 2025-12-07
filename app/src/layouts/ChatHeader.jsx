import React from "react";
import { IoMenu } from "react-icons/io5";
import useApp from "../store/useApp";

const Header = () => {
    const { toggleMenu } = useApp();
    return (
        <header className="chat-header">
            <div className="user">
            <img src="./ghs.png"/>
            <div className="user-name">
            <span>Ghs Julian</span>
            <p>Active Now</p>
            </div>
            </div>
            <label onClick={toggleMenu} htmlFor="menu" className="menu-btn">
                <IoMenu size={24} />
            </label>
        </header>
    );
};

export default Header;
