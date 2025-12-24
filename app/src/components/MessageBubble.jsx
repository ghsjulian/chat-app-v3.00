import React from "react";
import useAuth from "../store/useAuth";
import timeAgo from "../auth/formatter";

const MessageBubble = ({ chat }) => {
    const { user } = useAuth();
    const isSender =
        user?._id === chat?.sender?._id ? chat?.sender?._id : chat?.sender;

    return (
        <>
            <div className={`message ${isSender ? "sent" : "received"}`}>
                {chat?.text}
                <div className="message-time">
                    {timeAgo(chat.createdAt)}
                </div>
            </div>
        </>
    );
};

export default MessageBubble;
