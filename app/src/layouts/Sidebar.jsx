import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import useApp from "../store/useApp";
import useChat from "../store/useChat";
import User from "../components/User";
import InboxSkeleton from "../skeletons/InboxSkeleton";
import NoUser from "../components/NoUser";

const Sidebar = () => {
    const {
        isMenuActive,
        setPath,
        path
        
    } = useApp();
    const {isLoadingUsers,getChatUsers,renderUsers,chatUsers} = useChat()
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        setPath(location.pathname);
        getChatUsers()
    }, [location]);

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
            <div className="users-list">
                {isLoadingUsers && chatUsers === null ? (
                    <InboxSkeleton />
                ) : (
                    chatUsers?.length > 0 &&
                    chatUsers?.map((user, index) => {
                        return <User key={index} chatUser={user} />;
                    })
                )}
                {chatUsers?.length === 0 && !isLoadingUsers && <NoUser/>}
            </div>
        </aside>
    );
};

export default Sidebar;
