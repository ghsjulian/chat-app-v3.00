import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import Chatbox from "./Chatbox";
import Footer from "./Footer";
import "../styles/app.layout.css";

const Layouts = () => {
    return (
        <main className="main-container">
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
