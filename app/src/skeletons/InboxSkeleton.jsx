import React from "react";
import "../styles/inbox-skeletons.css"


const Sidebar = () => {
    let arr = [
        1,2,3,4,5,6,7,8,9,10
        ]
    return (
        <>
        {
            arr.map((element, index) =>{
                return (
                    <div key={index} className="sk--chat-item">
                    <div className="sk--avatar-skeleton"></div>
                    <div className="sk--text-lines">
                        <div className="sk--line-1"></div>
                        <div className="sk--line-2"></div>
                    </div>
                    <div className="sk--time-skeleton"></div>
                </div>
                    )
            })
        }
        </>
        )
};

export default Sidebar;
