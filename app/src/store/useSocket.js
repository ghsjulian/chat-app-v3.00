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
            //console.log(users);
        });

        socket.on("user:offline", users => {
            set({
                onlineUsers: users
            });
            console.log(users);
        });
        socket.on("disconnect", users => {
            set({
                connected: false
            });
            console.log("User Disconnected");
        });
        socket.on("connect_error", err => {
            console.error("Socket error:", err.message);
        });

        socket.on("message:receive", msg => {
            const selectedChat = useChatStore.getState().selectedChat
            useChatStore.getState().mergeMessage(msg?.message);
           // socket.emit("message:read", { from: msg.from });
        });
        socket.on("message:delivered", data => {
            window.dispatchEvent(
                new CustomEvent("chat:delivered", { detail: data })
            );
        });
        socket.on("message:read", data => {
            const selectedChat = useChatStore.getState().selectedChat
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
    }
}));

export default useSocket;
