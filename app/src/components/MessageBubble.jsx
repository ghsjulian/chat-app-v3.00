import React from "react";
import useAuth from "../store/useAuth";

const MessageBubble = ({ chat }) => {
    const { user } = useAuth();
    const isSender = user?._id === chat?.sender;

    return (
        <>
            <div className={`message ${isSender ? "sent" : "received"}`}>
                {chat?.text}
                <div className="message-time">10:34 AM</div>
            </div>
        </>
    );
};

export default MessageBubble;
