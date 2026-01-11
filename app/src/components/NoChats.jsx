import React from "react";

const NoChats = ({ chat }) => {
    return (
        <div className="no-chats">
            <img src="/icons/no-chats.png" alt="No Chats" />
            <h3>No chats yet !</h3>
            <p>
                Send a new message to start a conversation with{" "}
                <span>{chat?.name}</span>
            </p>
        </div>
    );
};

export default NoChats;
