import React from "react";
import "../styles/chats.skeleton.css";

const ChatsSkeleton = () => {
    return (
        <>
            <div
                className="msg sk-received"
                style={{ width: "65%", height: "50px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "50%", height: "40px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "70%", height: "50px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "55%", height: "80px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "75%", height: "70px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "40%", height: "45px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "60%", height: "55px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "65%", height: "60px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "50%", height: "40px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "70%", height: "50px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "55%", height: "80px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "75%", height: "70px" }}
            ></div>
            <div
                className="msg sk-received"
                style={{ width: "40%", height: "45px" }}
            ></div>
            <div
                className="msg sk-sent"
                style={{ width: "60%", height: "55px" }}
            ></div>
        </>
    );
};

export default ChatsSkeleton;
