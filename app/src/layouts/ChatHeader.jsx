import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import useSocket from "../store/useSocket";
import useChatStore from "../store/useChatStore";
import useApp from "../store/useApp";

const Header = () => {
    const { onlineUsers } = useSocket();
    const { toggleMenu } = useApp();
    const { selectedChat, setSelectedChat } = useChatStore();
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
                <img src={selectedChat?.avatar?.img_url || "/boy.png"} />
                <div className="user-name">
                    <span>{selectedChat?.name}</span>
                    {
                        onlineUsers.includes(selectedChat?._id) ? <p className="active">Active Now</p>
                        : <p className="offline">Offline Now</p>
                    }
                </div>
            </div>
        </header>
    );
};

export default Header;
