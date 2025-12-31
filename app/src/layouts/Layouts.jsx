import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import Footer from "./Footer";
import Chatbox from "./Chatbox";
import "../styles/app.layout.css";
import "../styles/dark.layout.css";
import useApp from "../store/useApp";
import useChatStore from "../store/useChatStore";

const Layouts = () => {
    const { chatSettings, path } = useApp();
    const { selectedChat } = useChatStore();

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
            {selectedChat && selectedChat?._id && <><Chatbox/> <ChatHeader /></>}
            
            <Outlet />
        </main>
    );
};

export default Layouts;
