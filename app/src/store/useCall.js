import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";
import useApp from "./useApp";
import useSocket from "./useSocket";
import useChatStore from "./useChatStore";

const useCall = create((set, get) => ({
    callerInfo: null,
    minimizedCaller: null,
    isCalling: false,
    isOnline: false,
    callTime: 0,
    callType: "Calling",
    callStatus: "START_INCOMMING_CALL",
    isMinimized: false,
    isMuted: false,

    setCalling: type => {
        let caller = get().callerInfo;
        set({
            isCalling: type,
            callType: "Calling...",
            callerInfo: useChatStore.getState().selectedChat
        });
        if (type) {
            useChatStore.setState({ selectedChat: null });
            get().startCall(caller);
        } else {
            useChatStore.setState({ selectedChat: caller });
            set({ callerInfo: null });
        }
    },
    minimizeCalling: () => {
        set({ isCalling: false });
    },
    startCall: caller => {
        const isOnline = useSocket
            .getState()
            .onlineUsers.includes(get().callerInfo?._id);
        const user = useAuth.getState()?.user;
        const info = {
            type: "START_INCOMMING_CALL",
            to: get().callerInfo,
            from: user
        };
        set({
            isOnline: isOnline,
            callType: isOnline ? "Ringing..." : "Calling..."
        });
        useSocket.getState().startincommingCall(info);
    },
    setReceiverCall: caller => {
        get().playRingtone();
        set({
            isCalling: true,
            callType: "Incoming Call",
            callerInfo: caller?.from,
            callStatus: "START_RECEIVING_CALL"
        });
        useChatStore.setState({ selectedChat: null });
    },
    acceptIncomingCall: () => {
        console.log("Accepting Call...");
    },
    playRingtone: () => {
        const audio = new Audio("/incoming-call.mp3");
        audio.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    },
    minimizeCall: type => {
        let caller = get().callerInfo;
        set({ isMinimized: type });
        if (type) {
            useChatStore.setState({ selectedChat: caller });
            set({ callerInfo: null ,minimizedCaller:caller});
        } else {
            const call = get().minimizedCaller;
            useChatStore.setState({ selectedChat: null });
            set({ callerInfo: call });
        }
    },
    toggleMute: () => {
        set({ isMuted: !get().isMuted });
    }
}));

export default useCall;
