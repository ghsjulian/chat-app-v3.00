import React, { useEffect, useState } from "react";
import useAuth from "../store/useAuth";
import useChatStore from "../store/useChatStore";
import timeAgo from "../auth/formatter";

const MessageBubble = ({ chat }) => {
    const { currentChats } = useChatStore();
    const { user } = useAuth();
    const isSender = user?._id === chat?.sender?._id;
    const len = currentChats?.length - 1;
    const isLast = currentChats[len]?.sender?._id === user?._id;
    const lastId = currentChats[len]?._id;

    return (
        <>
            <div className={`message ${isSender ? "sent" : "received"}`}>
                {chat?.text}
                <div className="message-time">{timeAgo(chat?.createdAt)}</div>
                {isLast && lastId === chat?._id && (
                    <div
                        className={`status ${chat?.seen?.toLocaleLowerCase()}`}
                    >
                        {chat?.seen?.toLocaleLowerCase()}
                    </div>
                )}
            </div>
        </>
    );
};

export default MessageBubble;
