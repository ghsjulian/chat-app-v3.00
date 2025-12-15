import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import Chatbox from "./Chatbox";
import Footer from "./Footer";
import "../styles/app.layout.css";
import useApp from "../store/useApp"

const Layouts = () => {
    const {chatSettings} = useApp()
    return (
        <main className={`main-container ${chatSettings.appTheme}`}>
            <Sidebar />
            {/*-->Add a condition,
            if selected user then 
            show chat header<--*/}
            {/*<ChatHeader/>*/}
            <Outlet />
        </main>
    );
};

export default Layouts;
