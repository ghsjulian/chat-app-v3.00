import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useChat from "../store/useChat";
import useApp from "../store/useApp";
import ChatsSkeleton from "../skeletons/ChatsSkeleton";

const Chats = () => {
    const { getChat, chats, isFetchingChats } = useChat();
    const { closeMedia, isMediaOpen } = useApp();
    const { id } = useParams();
    const bottomRef = useRef(null);

    useEffect(() => {
        getChat(id);
    }, [id]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, [chats]);

    return (
        <>
            <div className="chatbox">
                <div className="messages">
                    {isFetchingChats && chats?.length === 0 ? (
                        <ChatsSkeleton />
                    ) : (
                        chats?.map((message, index) =>
                            message?.files?.length > 0 ? (
                                <MediaBubble key={index} chat={message} />
                            ) : (
                                <MessageBubble key={index} chat={message} />
                            )
                        )
                    )}

                    {/* ✅ Invisible scroll target */}
                    <div ref={bottomRef} />
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
