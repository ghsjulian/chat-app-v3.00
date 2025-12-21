import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useChat from "../store/useChat";
import useApp from "../store/useApp";
import ChatsSkeleton from "../skeletons/ChatsSkeleton";

const Chats = () => {
    const { getChat, chats, isFetchingChats } = useChat();
    const { path, closeMedia, isMediaOpen } = useApp();
    const { id } = useParams();
    const chatBox = useRef(null);

    useEffect(() => {
        const isChat = path.split("/")[1];
        getChat(id);
        chatBox.current.scrollTo({
            top: chatBox.current.scrollHeight,
            behavior: "auto"
        });
    }, [path, id]);

    return (
        <>
            <div className="chatbox">
                <div ref={chatBox} className="messages">
                    {isFetchingChats ? (
                        <ChatsSkeleton />
                    ) : (
                        chats?.length > 0 &&
                        chats.map((message, index) => {
                            return message?.files?.length > 0 ? (
                                <MediaBubble key={index} chat={message} />
                            ) : (
                                <MessageBubble key={index} chat={message} />
                            );
                        })
                    )}
                </div>
                {isMediaOpen && (
                    <div className="media-preview">
                        <button onClick={closeMedia} id="close-media">
                            x
                        </button>
                        <RenderFile />
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Chats;
/*
<div class="preview-container">
  <!-- Image -->
  <div class="preview-item">
    <img src="image.jpg" alt="preview" />
  </div>

  <!-- Video (muted & paused) -->
  <div class="preview-item">
    <video src="video.mp4" muted preload="metadata"></video>
  </div>

  <!-- Audio -->
  <div class="preview-item audio">
    <audio src="audio.mp3" controls></audio>
  </div>
</div>

*/
