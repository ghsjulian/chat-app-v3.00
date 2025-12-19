import React from "react";
import { PiUsersDuotone } from "react-icons/pi";

const InboxSkeleton = () => {
    return (
        <div className="no-user">
            <PiUsersDuotone size={80} />
            <h4>No User Available!</h4>
        </div>
    );
};

export default InboxSkeleton;
