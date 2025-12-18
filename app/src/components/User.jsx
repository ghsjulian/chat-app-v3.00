import React from "react";
import { NavLink } from "react-router-dom";
import useApp from "../store/useApp";

const User = ({user}) => {
  const { toggleMenu } = useApp();
  return (
    <NavLink onClick={toggleMenu} className="" to={`/chats/${user?._id}`}>
      <div className="left">
        <div className="user-img">
          <img src={user?.avatar?.img_url || "/ghs.png"} />
          <div className="status"></div>
        </div>
        <div className="name">
          <span>{user?.name}</span>
          {user?.lastMessage && <p>{user?.lastMessage}</p>}
        </div>
      </div>
      <div className="right">
        {user?.lastMessage && <time>12:45 PM</time>}
      </div>
    </NavLink>
  );
};

export default User;
