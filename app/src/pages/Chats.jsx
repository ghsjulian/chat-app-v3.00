import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import useChat from "../store/useChat";
import useApp from "../store/useApp";

const Chats = () => {
    const { getChat, chats } = useChat();
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
                    {chats?.length > 0 &&
                        chats.map((message, index) => {
                            return message?.files?.length > 0 ? (
                                <MediaBubble key={index} chat={message} />
                            ) : (
                                <MessageBubble key={index} chat={message} />
                            );
                        })}
{/*
                    <div className="message sent">
                        <div className="sending-media">
                            <div className="media-item">
                                <img src="/boy.png" />
                                <div className="overly">
                                    <p>100%</p>
                                </div>
                            </div>
                            <div className="media-item">
                                <video controls>
                                    <source
                                        src="./video.mp4"
                                        type="video/mp4"
                                    />
                                </video>
                            </div>

                            <div className="media-item"></div>
                        </div>
                        Yeah! How have you been?
                        <div className="message-time">10:34 AM</div>
                    </div>
                    */}
                </div>
            </content>
            <Footer />
        </>
    );
};

export default Chats;
