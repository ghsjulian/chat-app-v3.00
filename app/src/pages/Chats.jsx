import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import useChat from "../store/useChat";
import useApp from "../store/useApp";

const Chats = () => {
    const { getChat } = useChat();
    const { path } = useApp();
    const { id } = useParams();

    useEffect(() => {
        const isChat = path.split("/")[1];
        getChat(id);
    }, [path, id]);

    return (
        <>
            <content className="chatbox">
                <div className="messages">
                    {/*All the chats will be render*/}
                    <MessageBubble />
                </div>
            </content>
                    <Footer />
        </>
    );
};

export default Chats;
