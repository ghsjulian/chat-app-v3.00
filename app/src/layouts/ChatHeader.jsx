import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useChatStore from "../store/useChatStore";
import useApp from "../store/useApp";

const Header = () => {
    const {toggleMenu} = useApp()
    const { selectedChat, setSelectedChat } = useChatStore();
    return (
        <header className="chat-header">
            <span id="back" onClick={() =>{toggleMenu(), setSelectedChat(null)}}>
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
