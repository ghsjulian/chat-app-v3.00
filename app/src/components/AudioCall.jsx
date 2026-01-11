import React, { useEffect, useState, useRef } from "react";
import useCall from "../store/useCall";
import { MdCall } from "react-icons/md";
import { MdCallEnd } from "react-icons/md";
import { TbWindowMinimize } from "react-icons/tb";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { GoUnmute } from "react-icons/go";

const AudioCall = () => {
    const {
        callerInfo,
        isCalling,
        callType,
        callStatus,
        isOnline,
        callTime,
        setCalling,
        acceptIncomingCall,
        isMinimized,
        minimizeCall,
        toggleMute,
        isMuted
    } = useCall();
    const localAudioRef = useRef();
    const remoteAudioRef = useRef();
    const peerRef = useRef(null);
    const [remoteId, setRemoteId] = useState("");

    const createPeer = async () => {
        peerRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        localAudioRef.current.srcObject = stream;

        stream
            .getTracks()
            .forEach(track => peerRef.current.addTrack(track, stream));

        peerRef.current.ontrack = event => {
            remoteAudioRef.current.srcObject = event.streams[0];
        };
        peerRef.current.onicecandidate = event => {
            if (event.candidate) {
                console.log("EVENT candidate : ", event.candidate);
            }
        };
    };

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
                        <button onClick={createPeer} className="receive">
                            <MdCall size={45} color="#ffffff" />
                        </button>

                        <button
                            onClick={() => minimizeCall(true)}
                            className="minimize"
                        >
                            <TbWindowMinimize size={45} color="#ffffff" />{" "}
                        </button>

                        <button onClick={toggleMute} className="receive">
                            {isMuted ? (
                                <IoVolumeMuteOutline
                                    size={45}
                                    color="#ffffff"
                                />
                            ) : (
                                <GoUnmute size={45} color="#ffffff" />
                            )}
                        </button>
                        <button
                            onClick={() => setCalling(false)}
                            className="reject"
                        >
                            <MdCallEnd size={45} color="#ffffff" />
                        </button>
                    </div>
                ) : (
                    <div className="action">
                        <button
                            onClick={acceptIncomingCall}
                            title="Accept Call"
                            className="receive"
                        >
                            <MdCall size={45} color="#ffffff" />
                        </button>
                        {callTime > 0 && (
                            <button className="minimize">
                                <TbWindowMinimize size={45} color="#ffffff" />{" "}
                            </button>
                        )}
                        <button className="receive">
                            <MdCall size={45} color="#ffffff" />
                        </button>
                        <button className="receive">
                            <MdCall size={45} color="#ffffff" />
                        </button>
                        <button
                            title="Reject Call"
                            onClick={() => setCalling(false)}
                            className="reject"
                        >
                            <MdCallEnd size={45} color="#ffffff" />
                        </button>
                    </div>
                )}
            </div>
            <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
        </div>
    );
};

export default AudioCall;
