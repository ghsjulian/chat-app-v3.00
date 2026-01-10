import React from "react";
import useCall from "../store/useCall";

const AudioCall = () => {
    const {
        callerInfo,
        isCalling,
        callType,
        callStatus,
        isOnline,
        callTime,
        setCalling,
        acceptIncomingCall
    } = useCall();

    return (
        <div className="chatbox-call">
            <div
                style={{
                    backgroundImage: `url(${callerInfo?.avatar?.img_url})`,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backgroundBlendMode: "overlay"
                }}
                className="call-box"
            >
                <img
                    className="user-image"
                    src={callerInfo?.avatar?.img_url}
                    alt={callerInfo?.name}
                />
                {callTime == 0 && <p>{callType}</p>}
                <h3>{callerInfo?.name}</h3>
                {callStatus === "START_INCOMMING_CALL" ? (
                    <div className="action">
                        <button className="receive">Receive</button>
                        <button
                            onClick={() => setCalling(false)}
                            className="reject"
                        >
                            Reject
                        </button>
                    </div>
                ) : (
                    <div className="action">
                        <button onClick={acceptIncomingCall} title="Accept Call" className="receive">
                            Receive Call
                        </button>
                        <button
                            title="Reject Call"
                            onClick={() => setCalling(false)}
                            className="reject"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioCall;
