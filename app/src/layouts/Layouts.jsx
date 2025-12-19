import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import Chatbox from "./Chatbox";
import Footer from "./Footer";
import "../styles/app.layout.css";
import "../styles/dark.layout.css";
import useChat from "../store/useChat";
import useApp from "../store/useApp";

const Layouts = () => {
  const { selectedChat } = useChat();
  const { chatSettings, path } = useApp();

  useEffect(() => {
    if (document.body.hasAttribute("class")) {
      document.body.removeAttribute("class");
    }
    document.body.classList.add(chatSettings.appTheme);
    if (chatSettings.appTheme === "dark") {
      document.body.style = "#000000";
    } else {
      document.body.style = "#ffffffff";
    }
  }, []);

  return (
    <main className={`main-container`}>
      <Sidebar />
      {/*-->Add a condition,
            if selected user then 
            show chat header<--*/}
      {selectedChat !== null && path !== "/" && path !== "/settings" && <ChatHeader />}
      <Outlet />
    </main>
  );
};

export default Layouts;
