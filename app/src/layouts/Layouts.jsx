import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chatbox from "./Chatbox";
import Footer from "./Footer";
import "../styles/app.layout.css";

const Layouts = () => {
    return <main className="main-container">
    <Sidebar/>
    <Header/>
    <Chatbox/>
    <Footer/>
    </main>;
};

export default Layouts;
