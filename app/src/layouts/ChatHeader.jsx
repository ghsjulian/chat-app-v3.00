import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useApp from "../store/useApp";

const Header = () => {
    const { toggleMenu } = useApp();
    return (
        <header className="chat-header">
            <span id="back" onClick={() => history.back()}>
                <IoArrowBackCircleOutline size={28} />
            </span>
            <div className="user">
                <img src="/boy.png" />
                {/*
                <div className="user-name">
                    <span>Ghs Julian</span>
                    <p>Active Now</p>
                </div>
                */}
            </div>
        </header>
    );
};

export default Header;
