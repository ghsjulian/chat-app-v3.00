import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import Chatbox from "../layouts/Chatbox";
import useChat from "../store/useChat";
import useApp from "../store/useApp";

const Chats = () => {
  const { setSelectedChat } = useChat();
  const { path } = useApp();
  const { id } = useParams();

  useEffect(() => {
    const isChat = path.split("/")[1];
    setSelectedChat(id);
  }, [path, id]);

  return (
    <>
      <Chatbox />
      <Footer />
    </>
  );
};

export default Chats;
