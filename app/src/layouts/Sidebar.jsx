import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import useApp from "../store/useApp";
import useChat from "../store/useChat";
import User from "../components/User";
import InboxSkeleton from "../skeletons/InboxSkeleton";
import NoUser from "../components/NoUser";

const Sidebar = () => {
    const { isMenuActive, setPath, path } = useApp();
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
    useEffect(() => {
        setPath(location.pathname);
        getChatUsers();
    }, [location]);
    
    const handleScroll = useCallback(async () => {
        const list = listRef.current;
        if (!list || !hasMoreUsers || loadingMoreUsers) return;

        if (list.scrollTop < 30) {
            const prevHeight = list.scrollHeight;
            await loadMoreUsers();

            requestAnimationFrame(() => {
                const newHeight = box.scrollHeight;
                list.scrollTop = newHeight - prevHeight;
            });
        }
    }, [loadMoreUsers, hasMoreUsers, loadingMoreUsers]);

    return (
        <aside className={path === "/" ? "sidebar active-menu" : "sidebar"}>
            <div className="side-top">
                <div className="heading">
                    <h3>Chats</h3>
                    <div onClick={() => navigate("/settings")} className="icon">
                        <IoSettingsOutline size={24} />
                    </div>
                </div>
                <div className="search">
                    <input
                        onChange={async e => {
                            setSearchTerm(e.target.value);
                            await renderUsers(e.target.value);
                        }}
                        value={searchTerm}
                        type="text"
                        placeholder="Search users..."
                    />
                    <IoSearchOutline size={24} />
                </div>
            </div>
            <div ref={listRef} onScroll={handleScroll} className="users-list">
                {isLoadingUsers && chatUsers === null ? (
                    <InboxSkeleton />
                ) : (
                    chatUsers?.length > 0 &&
                    chatUsers?.map((user, index) => {
                        return <User key={index} chatUser={user} />;
                    })
                )}
                {chatUsers?.length === 0 && !isLoadingUsers && <NoUser />}
            </div>
        </aside>
    );
};

export default Sidebar;
