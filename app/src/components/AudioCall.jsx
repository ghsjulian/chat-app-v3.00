import React, { useRef } from "react";
import useCall from "../store/useCall";
import { MdCall, MdCallEnd } from "react-icons/md";
import { TbWindowMinimize } from "react-icons/tb";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { GoUnmute } from "react-icons/go";

const AudioCall = () => {
    const {
        callerInfo,
        callType,
        callStatus,
        callTime,
        setCalling,
        acceptIncomingCall,
        minimizeCall,
        toggleMute,
        isMuted
    } = useCall();

    const localAudioRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const peerRef = useRef(null);

    /* =====================================================
     PEER CONNECTION SETUP
     ===================================================== */
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
                console.log("ICE_CANDIDATE");
                console.log(JSON.stringify(event.candidate));

                /* 🔌 SOCKET PLACE
           socket.emit("ice-candidate", event.candidate);
        */
            }
        };
    };

    /* =====================================================
     CALLER → CREATE OFFER
     ===================================================== */
    const startCall = async () => {
        await createPeer();
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);
        console.log("OFFER_SDP");
        console.log(JSON.stringify(offer));
        /* 🔌 SOCKET PLACE
       socket.emit("call-user", offer);
    */
    };

    /* =====================================================
     RECEIVER → ACCEPT OFFER + CREATE ANSWER
     ===================================================== */
    const acceptOffer = async offerFromConsole => {
        await createPeer();

        const offer = JSON.parse(offerFromConsole);
        await peerRef.current.setRemoteDescription(offer);

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        console.log("ANSWER_SDP");
        console.log(JSON.stringify(answer));

        /* 🔌 SOCKET PLACE
       socket.emit("answer-call", answer);
    */
    };

    /* =====================================================
     CALLER → APPLY ANSWER
     ===================================================== */
    const applyAnswer = async answerFromConsole => {
        const answer = JSON.parse(answerFromConsole);
        await peerRef.current.setRemoteDescription(answer);
        /* 🔌 SOCKET PLACE
       socket.on("call-accepted", answer);
    */
    };

    /* =====================================================
     APPLY ICE CANDIDATE (BOTH SIDES)
     ===================================================== */
    const applyIceCandidate = async candidateFromConsole => {
        const candidate = JSON.parse(candidateFromConsole);
        await peerRef.current.addIceCandidate(candidate);
        /* 🔌 SOCKET PLACE
       socket.on("ice-candidate", candidate);
    */
    };

    return (
        <div className="chatbox-call">
            <div
                className="call-box"
                style={{
                    backgroundImage: `url(${callerInfo?.avatar?.img_url})`,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backgroundBlendMode: "overlay"
                }}
            >
                <img
                    className="user-image"
                    src={callerInfo?.avatar?.img_url}
                    alt={callerInfo?.name}
                />

                {callTime === 0 && <p>{callType}</p>}
                <h3>{callerInfo?.name}</h3>
                {callStatus === "START_INCOMMING_CALL" ? (
                    <div className="action">
                        <button className="receive">
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
                            onClick={acceptOffer}
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
