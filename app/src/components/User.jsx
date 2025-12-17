import React from "react";
import { NavLink } from "react-router-dom";
import useApp from "../store/useApp";

const User = () => {
  const { toggleMenu } = useApp();
  return (
    <NavLink onClick={toggleMenu} className="" to="/chats/ghs">
      <div className="left">
        <div className="user-img">
          <img src="./ghs.png" />
          <div className="status"></div>
        </div>
        <div className="name">
          <span>Ghs Julian</span>
          <p>This is a test message</p>
        </div>
      </div>
      <div className="right">
        <time>12:45 PM</time>
      </div>
    </NavLink>
  );
};

export default User;
