import { create } from "zustand";
import axios from "../libs/axios";
import {
    saveMessages,
    getMessages,
    mergeMessages,
    updateMessagesById
} from "../libs/indexDB";
import { io } from "socket.io-client";
import useAuth from "./useAuth";
import useApp from "./useApp";

const SOCKET_SERVER = "/";
const MESSAGES_PER_PAGE = 15;
const useSocket = create((set, get) => ({
    socket: null,
    connected: false,
    onlineUsers: [],
    messages: [],
    typing: [],
    isTyping: false,
    hasMore: true,
    loadingMore: false,

    createConnection: async () => {
        if (get().socket) return;

        const socket = io(SOCKET_SERVER, {
            transports: ["websocket"],
            auth: { user: useAuth.getState()?.user },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        socket.on("connect", () => {
            set({ connected: true });
        });
        socket.on("disconnect", () => {
            console.log("❌ Socket Disconnected!");
            set({ connected: false });
        });
        socket.on("connect_error", err => {
            console.error("⚠️ Connection Error : ", err.message);
        });
        socket.on("handshake-success", async data => {
            console.info(`✅ Socket Connected : ${data?.clientId}\n`);
        });
        /*------> Handle Emits <-----*/
        socket.on("chat-users", async users => {
            set({ onlineUsers: users });
        });
        socket.on("receive-message", message => {
            // console.log("Received Message - ", message);
            set({ messages: [...get().messages, message] });
        });
        socket.on("typing-status", userList => {
            set({ typing: userList });
        });

        // Set The Socket Object
        set({ socket });
    },

    sendMessage: async message => {
        try {
            await useApp.getState().getChatUsers();
            set({ messages: [...get().messages, message] });
            if (get().onlineUsers.includes(message?.receiver_id)) {
                get().socket.emit("send-message", {
                    to: message?.receiver_id,
                    from: message?.sender_id,
                    message
                });
            }
            const response = await axios.post(
                `/messages/send-message/${message.receiver_id}`,
                message
            );
            await saveMessages(message.receiver_id, response?.data);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    },
    getChats: async receiverId => {
        try {
            set({ messages: [] });
            // Load from IndexedDB
            const localMessages = await getMessages(receiverId);
            const last15 = localMessages.slice(-MESSAGES_PER_PAGE);
            set({ messages: last15, hasMore: true });
            // Fetch latest from server and merge
            const response = await axios.get(
                `/messages/get-chats?id=${receiverId}`
            );
            if (response?.data?.success && Array.isArray(response.data.chats)) {
                // await mergeMessages(receiverId, response.data.chats);
                // Refresh state after merging
                const chats = response.data.chats;
                set({ messages: chats });
                await updateMessagesById(receiverId, chats);
                const updatedLocal = await getMessages(receiverId);
            } 
        } catch (error) {set({ messages: [] });
        }
    },

    // Load more messages (from server only)
    loadMoreMessages: async receiverId => {
        const { messages, loadingMore, hasMore } = get();
        if (loadingMore || !hasMore) return;

        set({ loadingMore: true });
        try {
            const oldestTime = messages[0]?.time;
            const response = await axios.get(
                `/messages/load-older?id=${receiverId}&before=${oldestTime}`
            );
            if (response?.data?.success && response.data.messages.length > 0) {
                set({
                    messages: [...response.data.messages, ...messages],
                    hasMore:
                        response.data.messages.length === MESSAGES_PER_PAGE,
                    loadingMore: false
                });
            } else {
                set({ hasMore: false, loadingMore: false });
            }
        } catch (error) {
            console.error("Error loading older messages:", error);
            set({ loadingMore: false });
        } finally {
            set({ loadingMore: false, hasMore: false });
        }
    },
    setTyping: (id, status) => {
        set({ isTyping: status });
        if (get().onlineUsers.includes(id)) {
            get().socket.emit("typing-status", {
                to: id,
                typer: useAuth.getState().user?._id,
                isTyping: status
            });
        }
    }
}));

export default useSocket;
