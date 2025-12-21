import React, { useEffect, useState } from "react";
import { PiChatsCircleDuotone } from "react-icons/pi";

const Home = () => {
  return (
    <div className="home-page">
      <div className="page">
        <PiChatsCircleDuotone size={120} />
        <p id="content">Select a chat to start a new conversation !</p>
        <p id="info-text">Your chats will be appear here.</p>
      </div>
    </div>
  );
};

export default Home;
