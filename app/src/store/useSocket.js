import { create } from "zustand";
import { io } from "socket.io-client";
import useAuth from "./useAuth";
import useChatStore from "./useChatStore";

const SOCKET_SERVER = "http://localhost:3000";

const useSocket = create((set, get) => ({
    socket: null,
    connected: false,
    onlineUsers: [],

    createSocket: () => {
        if (get().socket) return;
        const user = useAuth.getState().user;
        if (!user) return;

        const socket = io(SOCKET_SERVER, {
            path: "/socket.io",
            transports: ["websocket"],
            auth: { token: user },
            autoConnect: false
        });

        socket.on("connect", () => {
            set({ connected: true });
        });
        socket.on("users:online:list", users => {
            set({
                onlineUsers: users
            });
        });

        socket.on("user:offline", users => {
            set({
                onlineUsers: users
            });
        });
        socket.on("disconnect", () => {
            set({
                connected: false,
                socket: null
            });
        });
        socket.on("connect_error", err => {
            set({ connected: false, socket: null });
            console.error("Socket error:", err.message);
        });

        socket.on("message:receive",  msg => {
            const selectedChat = useChatStore.getState().selectedChat;

            useChatStore.getState().playRingtone();
            useChatStore.getState().mergeMessage(msg);
            if (selectedChat?._id === msg?.sender?._id) {
                socket.emit("message:read", {
                    from: msg?.sender?._id,
                    msgId: msg?.tempId,
                    status: "SEEN"
                });
            }
        });
        socket.on("message:delivery-status", data => {
            useChatStore.getState().updateDelivery(data);
        });
        socket.on("message:read", data => {
            const selectedChat = useChatStore.getState().selectedChat;
            useChatStore.getState().updateStatus(data);
        });
        socket.on("seen-status:success", data => {
            const selectedChat = useChatStore.getState().selectedChat;
            useChatStore.getState().setSeenSuccess(data);
        });
        socket.on("typing:start", userId => {
            window.dispatchEvent(
                new CustomEvent("chat:typing:start", { detail: userId })
            );
        });
        socket.on("typing:stop", userId => {
            window.dispatchEvent(
                new CustomEvent("chat:typing:stop", { detail: userId })
            );
        });
        socket.connect();
        set({ socket });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (!socket) return;
        socket.removeAllListeners();
        socket.disconnect();
        set({ socket: null, connected: false });
    },
    sendMessage: (to, message) => {
        const socket = get().socket;
        if (!socket || !get().connected) return;
        socket.emit("message:send", {
            to,
            message
        });
    },
    startTyping: to => {
        get().socket?.emit("typing:start", to);
    },
    stopTyping: to => {
        get().socket?.emit("typing:stop", to);
    },
    setDelivery: users => {
        const socket = get().socket;
        if (!socket) return;
        get().socket?.emit("delivery:status", users);
    },
    setSeen: data => {
        const socket = get().socket;
        if (!socket) return;
        get().socket?.emit("seen:status", data);
    }
}));

export default useSocket;
