import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";
import useApp from "./useApp";
import { io } from "socket.io-client";
import {
    saveMessages,
    getMessages,
    mergeMessages,
    updateMessagesById
} from "../auth/indexDB";

const SOCKET_SERVER = "http://localhost:3000";
const MESSAGES_PER_PAGE = 15;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRY = 3;
const useChat = create((set, get) => ({
    selectedChat: null,
    chatUsers: [],
    chats: [],
    inboxUsers: [],
    uploadProgress: {},
    isLoadingUsers: false,
    isFetchingChats: false,
    isSendingMessage: false,
    loadingMore: false,
    hasMore: false,
    loadingMoreUsers: false,
    hasMoreUsers: false,
    socket: null,

    createSocket: () => {
        if (get().socket !== null) return;
        const newSocket = io("http://localhost:3000", {
            auth: { token: useAuth.getState().user }
        });
        set({ socket: newSocket });
        /*
// start chat
socket.emit("chat:init", { receiverId }, (chat) => {
  setChat(chat);
});

// send message
socket.emit("message:send", {
  chatId,
  receiverId,
  text: "Hello"
});

// receive message
socket.on("message:new", (msg) => {
  setMessages(prev => [...prev, msg]);
});
*/
    },

    getChat: async (id, chatid) => {
        if (!id) return;
        set({ selectedChat: null, chats: [] });
        set({ isFetchingChats: true });
        const localMessages = await getMessages(chatid);
        const last15 = localMessages.slice(-MESSAGES_PER_PAGE);
        set({ chats: last15, hasMore: true });

        try {
            const response = await axios.get(
                `/chats/get-chats?id=${id}&chatid=${chatid}`
            );
            if (response?.data?.success) {
                set({
                    selectedChat: response?.data?.user
                });
                const chats = response?.data?.messages;
                await updateMessagesById(response?.data?.user?.chatid, chats);
                const updatedLocal = await getMessages(
                    response?.data?.user?.chatid
                );
                set({ chats: updatedLocal });
                console.log("GET ALL CHATS : ", updatedLocal);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isFetchingChats: false });
        }
    },
    getChatUsers: async () => {
        let cachesUsers =
            JSON.parse(localStorage.getItem("inbox-user")) || null;
        set({ chatUsers: cachesUsers });
        set({ isLoadingUsers: true });
        get().createSocket();
        try {
            const response = await axios.get(
                `/chats/get-chat-users?term=${""}&limit=15`
            );
            if (response?.data?.success) {
                set({ chatUsers: response?.data?.users });
                localStorage.setItem(
                    "inbox-user",
                    JSON.stringify(response?.data?.users)
                );
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isLoadingUsers: false });
        }
    },
    renderUsers: async (term, filter = {}) => {
        set({ isLoadingUsers: true, chatUsers: null });

        try {
            const response = await axios.get(
                `/chats/get-chat-users?term=${term}&limit=15`
            );
            if (response?.data?.success) {
                set({ chatUsers: response?.data?.users });
                if (term === "") {
                    localStorage.setItem(
                        "inbox-user",
                        JSON.stringify(response?.data?.users)
                    );
                }
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    uploadFileChunks: async fileObj => {
        const { file, uploadId, uploadedChunks = 0 } = fileObj;

        if (!file || !uploadId) {
            throw new Error("Invalid file object");
        }

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (
            let chunkIndex = uploadedChunks;
            chunkIndex < totalChunks;
            chunkIndex++
        ) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            let attempt = 0;
            let success = false;

            while (!success && attempt < MAX_RETRY) {
                try {
                    await axios.post(
                        `/chats/upload-chunks` +
                            `?uploadid=${uploadId}` +
                            `&chunkindex=${chunkIndex}` +
                            `&totalchunks=${totalChunks}` +
                            `&filename=${encodeURIComponent(file.name)}` +
                            `&filesize=${file.size}`,
                        chunk,
                        {
                            headers: {
                                "Content-Type": "application/octet-stream"
                            },
                            timeout: 0
                        }
                    );

                    success = true;

                    set(state => ({
                        uploadProgress: {
                            ...state.uploadProgress,
                            [uploadId]: Math.round(
                                ((chunkIndex + 1) / totalChunks) * 100
                            )
                        }
                    }));
                } catch (err) {
                    attempt++;
                    if (attempt >= MAX_RETRY) {
                        throw new Error(`Upload failed: ${file.name}`);
                    }
                }
            }
        }

        return {
            id: uploadId,
            type: file.type.split("/")[0],
            filename: `${uploadId}.${file.name.split(".").pop()}`,
            src_url: `${useApp.getState().api}/${uploadId}.${file.name
                .split(".")
                .pop()}`,
            size: file.size
        };
    },

    sendMessage: async (files, text) => {
        try {
            set({ isSendingMessage: true });
            let uploadedFiles = [];

            const newMessage = {
                sender: {
                    _id: useAuth.getState().user._id
                },
                receiver: get().selectedChat._id,
                text,
                files,
                createdAt: Date.now()
            };
            set({
                chats: [...get().chats, newMessage]
            });

            if (files.length > 0) {
                uploadedFiles = await Promise.all(
                    files.map(fileObj => get().uploadFileChunks(fileObj))
                );
            }
            const response = await axios.post(
                `/chats/send-message?id=${get().selectedChat._id}&chatid=${
                    get().selectedChat.chatid
                }`,
                {
                    text,
                    files: uploadedFiles
                }
            );
            if (response?.data?.success) {
                await saveMessages(
                    get().selectedChat.chatid,
                    response?.data?.newMessage
                );
                const updatedLocal = await getMessages(
                    get().selectedChat.chatid
                );
                // set({ chats: updatedLocal });
                console.log("NEW SENT MESSAGE - ", updatedLocal);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            set({ isSendingMessage: false });
        }
    },
    loadMoreMessages: async receiverId => {
        const { chats, loadingMore, hasMore } = get();
        if (loadingMore || !hasMore) return;
        if (get().selectedChat === null) return;

        set({ loadingMore: true });
        try {
            const oldestTime = chats[0]?.createdAt;
            const response = await axios.get(
                `/chats/load-older-messages?chatid=${
                    get()?.selectedChat?.chatid
                }&before=${oldestTime}`
            );
            if (response?.data?.success && response.data.messages.length > 0) {
                set({
                    chats: [...response.data.messages, ...chats],
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
    loadMoreUsers: async receiverId => {
        const { chatUsers, loadingMoreUsers, hasMoreUsers } = get();
        if (loadingMoreUsers || !hasMoreUsers) return;

        set({ loadingMoreUsers: true });
        try {
            const usersLen = chatUsers?.length;
            const oldestTime = chatUsers[usersLen]?.createdAt;
            const response = await axios.get(
                `/chats/get-old-chat-users?next=${oldestTime}`
            );
            console.log("MORE LOADING USERS : ", response.data);
        } catch (error) {
            console.error("Error loading older messages:", error);
            set({ loadingMoreUsers: false });
        } finally {
            set({ loadingMoreUsers: false, hasMoreUsers: false });
        }
    }
}));

export default useChat;
