import React, { useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useChat from "../store/useChat";
import useApp from "../store/useApp";
import ChatsSkeleton from "../skeletons/ChatsSkeleton";
import NoChats from "../components/NoChats";

const Chats = () => {
    const {
        getChat,
        chats,
        isFetchingChats,
        loadMoreMessages,
        hasMore,
        loadingMore,
        selectedChat
    } = useChat();

    const { closeMedia, isMediaOpen } = useApp();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const chatid = searchParams.get("chatid");

    const containerRef = useRef(null); // scroll container
    const bottomRef = useRef(null); // bottom marker
    const isInitialLoad = useRef(true);

    /* ===============================
       FETCH CHAT WHEN ID CHANGES
    =============================== */
    useEffect(() => {
        isInitialLoad.current = true;
        getChat(id, chatid ? chatid : undefined);
    }, [id]);

    /* ===============================
       SCROLL TO BOTTOM ON FIRST LOAD
    =============================== */
    /*
    useEffect(() => {
        if (!containerRef.current || chats.length === 0) return;

        if (isInitialLoad.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            isInitialLoad.current = false;
        }
    }, [chats]);
*/
    /* ===============================
       LOAD OLD MESSAGES ON TOP SCROLL
    =============================== */
    const handleScroll = useCallback(async () => {
        const box = containerRef.current;
        if (!box || !hasMore || loadingMore) return;

        if (box.scrollTop < 30) {
            const prevHeight = box.scrollHeight;
            await loadMoreMessages(id);

            requestAnimationFrame(() => {
                const newHeight = box.scrollHeight;
                box.scrollTop = newHeight - prevHeight;
            });
        }
    }, [loadMoreMessages, hasMore, loadingMore, id]);

    /* ===============================
       AUTO SCROLL ON NEW MESSAGE ONLY
    =============================== */
    useEffect(() => {
        if (!containerRef.current) return;

        const box = containerRef.current;
        const isNearBottom =
            box.scrollHeight - box.scrollTop - box.clientHeight < 120;

        // if (isNearBottom) {
        //             bottomRef.current?.scrollIntoView();
        //         }
        bottomRef.current?.scrollIntoView();
    }, [chats]);

    return (
        <>
            <div className="chatbox">
                <div
                    ref={containerRef}
                    className="messages"
                    onScroll={handleScroll}
                >
                    {!isFetchingChats && chats?.length == 0 && (
                        <NoChats chat={selectedChat} />
                    )}
                    {loadingMore && (
                        <div className="loading-msg">
                            <div className="loading"></div>
                        </div>
                    )}

                    {isFetchingChats && chats.length === 0 ? (
                        <ChatsSkeleton />
                    ) : (
                        chats.map((message, index) =>
                            message?.files?.length > 0 ? (
                                <MediaBubble key={index} chat={message} />
                            ) : (
                                <MessageBubble key={index} chat={message} />
                            )
                        )
                    )}

                    {/* Bottom scroll anchor */}
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

/*
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Footer from "../layouts/Footer";
import MessageBubble from "../components/MessageBubble";
import MediaBubble from "../components/MediaBubble";
import RenderFile from "../components/RenderFile";
import useChat from "../store/useChat";
import useApp from "../store/useApp";
import ChatsSkeleton from "../skeletons/ChatsSkeleton";

const Chats = () => {
    const {
        getChat,
        chats,
        isFetchingChats,
        loadMoreMessages,
        hasMore,
        loadingMore
    } = useChat();
    const { closeMedia, isMediaOpen } = useApp();
    const { id } = useParams();
    const bottomRef = useRef(null);
    const [initialLoaded, setInitialLoaded] = useState(false);

    useEffect(() => {
        getChat(id);
        setInitialLoaded(true);
    }, [id]);
    // Scroll to bottom once after initial load
    useEffect(() => {
        if (!initialLoaded) return;
        const box = bottomRef.current;
        if (box) box.scrollTop = box.scrollHeight;
    }, [initialLoaded, id]);

    // Load more when scrolling to top (fetch oldest)
    const handleScroll = useCallback(async () => {
        const box = bottomRef.current;
        if (!box || !hasMore || loadingMore) return;
        if (box.scrollTop <= 20) {
            const oldScrollHeight = box.scrollHeight;
            await loadMoreMessages(id);
            requestAnimationFrame(() => {
                const newScrollHeight = box.scrollHeight;
                box.scrollTop = newScrollHeight - oldScrollHeight;
            });
        }
    }, [loadMoreMessages, hasMore, loadingMore]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, [chats]);

    return (
        <>
            <div className="chatbox">
                <div onScroll={handleScroll} className="messages">
                    {loadingMore && (
                        <div className="loading-msg">Loading...</div>
                    )}
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
*/
