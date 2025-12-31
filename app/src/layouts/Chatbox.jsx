import React, { useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useApp from "../store/useApp";
import useChatStore from "../store/useChatStore";
import ChatsSkeleton from "../skeletons/ChatsSkeleton";
import NoChats from "../components/NoChats";

const Chatbox = () => {
    const {
        currentChats,
        getChats,
        isFetchingChats,
        loadMoreMessages,
        hasMore,
        loadingMore
    } = useChatStore();
    const { selectedChat } = useChatStore();
    const { closeMedia, isMediaOpen } = useApp();
    const containerRef = useRef(null); // scroll container
    const bottomRef = useRef(null); // bottom marker
    const isInitialLoad = useRef(true);


    useEffect(() => {
        isInitialLoad.current = true;
        getChats();
    }, [selectedChat, getChats]);

    const handleScroll = useCallback(async () => {
        const box = containerRef.current;
        if (!box || !hasMore || loadingMore) return;
        if (box.scrollTop < 30) {
            const prevHeight = box.scrollHeight;
            await loadMoreMessages();
            requestAnimationFrame(() => {
                const newHeight = box.scrollHeight;
                box.scrollTop = newHeight - prevHeight;
            });
        }
    }, [loadMoreMessages, hasMore, loadingMore, selectedChat]);

    useEffect(() => {
        if (!containerRef.current) return;
        const box = containerRef.current;
        const isNearBottom =
            box.scrollHeight - box.scrollTop - box.clientHeight < 120;
        bottomRef.current?.scrollIntoView();
    }, [currentChats]);

    return (
        <>
            <div className="chatbox">
                <div
                    ref={containerRef}
                    className="messages"
                    onScroll={handleScroll}
                >
                    {!isFetchingChats && currentChats?.length == 0 && (
                        <NoChats chat={selectedChat} />
                    )}
                    {loadingMore && (
                        <div className="loading-msg">
                            <div className="loading"></div>
                        </div>
                    )}

                    {isFetchingChats && currentChats.length === 0 ? (
                        <ChatsSkeleton />
                    ) : (
                        currentChats.map((message, index) =>
                            message?.files?.length > 0 ? (
                                <MediaBubble key={index} chat={message} />
                            ) : (
                                <MessageBubble key={index} chat={message} />
                            )
                        )
                    )}
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

export default Chatbox;
