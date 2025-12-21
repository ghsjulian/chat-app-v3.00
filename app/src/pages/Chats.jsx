import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useChat from "../store/useChat";
import useApp from "../store/useApp";

const Chats = () => {
    const { getChat, chats } = useChat();
    const { path, closeMedia, isMediaOpen } = useApp();
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

</div>
                {/*Preview Media*/}
                {isMediaOpen && (
                    <div className="media-preview">
                        <button onClick={closeMedia} id="close-media">
                            x
                        </button>
                        <RenderFile />
                    </div>
                )}
            </content>
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
