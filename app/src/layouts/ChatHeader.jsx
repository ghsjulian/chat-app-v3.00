import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { MdAddIcCall } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import useSocket from "../store/useSocket";
import useChatStore from "../store/useChatStore";
import useApp from "../store/useApp";
import useCall from "../store/useCall";

const Header = () => {
    const { onlineUsers } = useSocket();
    const { toggleMenu } = useApp();
    const { selectedChat, setSelectedChat } = useChatStore();
    const {isCalling,setCalling} = useCall() 
    
    return (
        <header className="chat-header">
            <div className="user">
                <span
                    id="back"
                    onClick={() => {
                        toggleMenu(), setSelectedChat(null);
                    }}
                >
                    <MdKeyboardBackspace size={36} />
                </span>
                <img src={selectedChat?.avatar?.img_url || "/icons/boy.png"} />
                <div className="user-name">
                    <span>{selectedChat?.name}</span>
                    {onlineUsers.includes(selectedChat?._id) ? (
                        <p className="active">Active Now</p>
                    ) : (
                        <p className="offline">Offline Now</p>
                    )}
                </div>
            </div>
            <div className="chat-action">
            <button onClick={()=>setCalling(true)} className="action-btn">
                <MdAddIcCall size={36} />
                </button>
                 <button className="action-btn">
                <IoVideocamOutline size={36} />
                </button>
            </div>
        </header>
    );
};

export default Header;
