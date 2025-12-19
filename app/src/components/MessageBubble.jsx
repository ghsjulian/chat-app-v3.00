import React from "react";

const MessageBubble = ({ chat }) => {
    return (
        <>
            <div className="message sent">
                {chat?.text}
                <div className="message-time">10:34 AM</div>
            </div>
            {/*
      <div className="message received">
        Hey! Long time no see
        <div className="message-time">10:32 AM</div>
      </div>
      <div className="message sent">
        Yeah! How have you been?
        <div className="message-time">10:34 AM</div>
      </div>
      */}
        </>
    );
};

export default MessageBubble;
