import React from "react";
import { NavLink } from "react-router-dom";
import useApp from "../store/useApp";
import useAuth from "../store/useAuth";
import timeAgo from "../auth/formatter";
import useSocket from "../store/useSocket";
import useChatStore from "../store/useChatStore";

const User = ({ chatUser }) => {
    const { toggleMenu } = useApp();
    const { user } = useAuth();
    const { onlineUsers } = useSocket();
    const { setSelectedChat } = useChatStore();
    const isMe = user?._id === chatUser?.sender;

    return (
        <NavLink
            onClick={e => {
                toggleMenu();
                setSelectedChat(chatUser);
            }}
            className=""
            to="#"
        >
            <div className="left">
                <div className="user-img">
                    <img src={chatUser?.avatar?.img_url || "/boy.png"} />
                    <div
                        className={`status ${
                            onlineUsers.includes(chatUser?._id)
                                ? "online"
                                : "offline"
                        }`}
                    ></div>
                </div>
                <div className="name">
                    <span>{chatUser?.name}</span>
                    {chatUser?.lastMessage && (
                        <p>
                            {isMe && "You : "}
                            {chatUser?.lastMessage}
                        </p>
                    )}
                </div>
            </div>
            {chatUser?.unseenCount !== 0 &&
            <div className="budget">
                <div>{chatUser?.unseenCount}</div>
            </div>
            }
            <div className="right">
                {chatUser?.lastMessage && <time>{timeAgo(chatUser.time)}</time>}
            </div>
        </NavLink>
    );
};

export default User;
