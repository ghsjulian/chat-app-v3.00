import React from "react";
import MessageBubble from "../components/MessageBubble";

const Chatbox = () => {
  return (
    <>
      <content className="chatbox">
        <div className="messages">
          <MessageBubble />
          <MessageBubble />
          <MessageBubble />
          <MessageBubble />
          <MessageBubble />
          <MessageBubble />
        </div>
      </content>
    </>
  );
};

export default Chatbox;
