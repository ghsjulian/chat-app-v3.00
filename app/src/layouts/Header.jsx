import React from "react";
import { IoMenu } from "react-icons/io5";
import useApp from "../store/useApp"

const Header = () => {
    const {toggleMenu} = useApp()
    return (
        <header className="header">
            <h3>ChatApp</h3>
            <label onClick={toggleMenu} htmlFor="menu" className="menu-btn">
                <IoMenu size={24} />
            </label>
        </header>
    );
};

export default Header;
