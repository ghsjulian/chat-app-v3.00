import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useChat from "../store/useChat";

const Header = () => {
    const { selectedChat } = useChat();
    return (
        <header className="chat-header">
            <span id="back" onClick={() => history.back()}>
                <IoArrowBackCircleOutline size={36} />
            </span>
            <div className="user">
                <img src={selectedChat?.avatar?.img_url || "/boy.png"} />
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
