import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";

import useApp from "../store/useApp";
import useChat from "../store/useChat";

import User from "../components/User";
import InboxSkeleton from "../skeletons/InboxSkeleton";
import NoUser from "../components/NoUser";

const Sidebar = () => {
    const { setPath, path } = useApp();
    const {
        isLoadingUsers,
        getChatUsers,
        renderUsers,
        chatUsers,
        loadMoreUsers,
        loadingMoreUsers,
        hasMoreUsers
    } = useChat();

    const listRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    /* ===============================
       Initial Load
    =============================== */
    useEffect(() => {
        setPath(location.pathname);
        getChatUsers();
    }, [location.pathname]);

    /* ===============================
       Scroll DOWN to Load More
       (WhatsApp style)
    =============================== */
    /* ===============================
   Scroll DOWN to Load More
=============================== */
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

    /* ===============================
       Search
    =============================== */
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
        <aside className={path === "/" ? "sidebar active-menu" : "sidebar"}>
            {/* ===============================
               Header
            =============================== */}
            <div className="side-top">
                <div className="heading">
                    <h3>Chats</h3>
                    <div className="icon" onClick={() => navigate("/settings")}>
                        <IoSettingsOutline size={22} />
                    </div>
                </div>

                {/* ===============================
                   Search
                =============================== */}
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

            {/* ===============================
               Users List
            =============================== */}
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
                {loadingMoreUsers && (<>
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
                </>)}
            </div>
        </aside>
    );
};

export default Sidebar;
