import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";

import useApp from "../store/useApp";
import useChatStore from "../store/useChatStore";
import useSocket from "../store/useSocket";

import User from "../components/User";
import InboxSkeleton from "../skeletons/InboxSkeleton";
import NoUser from "../components/NoUser";

const Sidebar = () => {
    const { setPath, path, isMenuActive, toggleMenu } = useApp();
    const {
        isLoadingUsers,
        getChatUsers,
        renderUsers,
        chatUsers,
        loadMoreUsers,
        loadingMoreUsers,
        hasMoreUsers
    } = useChatStore();
    const { onlineUsers } = useSocket();
    const listRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setPath(location.pathname);
        getChatUsers();
    }, [location.pathname, onlineUsers]);
    useEffect(() => {
        const list = listRef.current;
        const onScroll = async () => {
            if (hasMoreUsers) return;
            const { scrollTop, scrollHeight, clientHeight } = list;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                await loadMoreUsers();
            }
        };
        list.addEventListener("scroll", onScroll);
        return () => {
            list.removeEventListener("scroll", onScroll);
        };
    }, [loadMoreUsers, hasMoreUsers, loadingMoreUsers]);

    const handleSearch = async e => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            await renderUsers(value);
        } else {
            await getChatUsers();
        }
    };

    return (
        <aside className={!isMenuActive ? "sidebar active-menu" : "sidebar"}>
            <div className="side-top">
                <div className="heading">
                    <h3>Chats</h3>
                    <div
                        className="icon"
                        onClick={() => {
                            toggleMenu(), navigate("/settings");
                        }}
                    >
                        <IoSettingsOutline size={22} />
                    </div>
                </div>

                <div className="search">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search users..."
                    />
                    <IoSearchOutline size={22} />
                </div>
            </div>

            <div ref={listRef} className="users-list">
                {/* Initial loading */}
                {isLoadingUsers && chatUsers === null && <InboxSkeleton />}

                {/* Users */}
                {chatUsers?.length > 0 &&
                    chatUsers.map(user => (
                        <User key={user._id} chatUser={user} />
                    ))}

                {/* Empty */}
                {chatUsers?.length === 0 && !isLoadingUsers && <NoUser />}

                {/* Bottom loader */}
                {loadingMoreUsers && (
                    <>
                        <div className="sk--chat-item">
                            <div className="sk--avatar-skeleton"></div>
                            <div className="sk--text-lines">
                                <div className="sk--line-1"></div>
                                <div className="sk--line-2"></div>
                            </div>
                            <div className="sk--time-skeleton"></div>
                        </div>
                        <div className="sk--chat-item">
                            <div className="sk--avatar-skeleton"></div>
                            <div className="sk--text-lines">
                                <div className="sk--line-1"></div>
                                <div className="sk--line-2"></div>
                            </div>
                            <div className="sk--time-skeleton"></div>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
