import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";
import useApp from "./useApp";
import useSocket from "./useSocket";
import useChatStore from "./useChatStore";

const useCall = create((set, get) => ({
    callerInfo: null,
    isCalling: false,
    isOnline: false,
    callTime: 0,

    setCalling: type => {
        let caller = get().callerInfo;
        set({
            isCalling: type,
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
            to_id: get().callerInfo?._id,
            from_id: user?._id,
            from_name: user?.name,
            from_avatar: user?.avatar?.img_url
        };
        set({ isOnline: isOnline });
        useSocket.getState().startincommingCall(info);
    },
    
}));

export default useCall;
