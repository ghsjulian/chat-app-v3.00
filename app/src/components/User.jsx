import React from "react";
import { NavLink } from "react-router-dom";
import useApp from "../store/useApp";
import useAuth from "../store/useAuth";

const User = ({ chatUser }) => {
    const { toggleMenu } = useApp();
    const { user } = useAuth();
    const isMe = user?._id === chatUser.sender;

    return (
        <NavLink onClick={toggleMenu} className="" to={`/chats/${chatUser?._id}`}>
            <div className="left">
                <div className="user-img">
                    <img src={chatUser?.avatar?.img_url || "/boy.png"} />
                    <div className="status"></div>
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
            <div className="right">
                {chatUser?.lastMessage && <time>12:45 PM</time>}
            </div>
        </NavLink>
    );
};

export default User;
