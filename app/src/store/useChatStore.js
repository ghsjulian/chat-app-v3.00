import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";
import useApp from "./useApp";
import useSocket from "./useSocket";
import {
    saveMessages,
    getMessages,
    mergeMessages,
    updateMessagesById
} from "../auth/indexDB";

const MESSAGES_PER_PAGE = 15;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRY = 3;
const useChatStore = create((set, get) => ({
    selectedChat: null,
    currentChats: [],
    chatUsers: [],
    uploadProgress: {},
    isLoadingUsers: false,
    isFetchingChats: false,
    isSendingMessage: false,
    loadingMore: false,
    hasMore: false,
    loadingMoreUsers: false,
    hasMoreUsers: false,

    setSelectedChat: user => {
        set({ selectedChat: user });
    },
    getChats: async () => {
        if (!get().selectedChat) return;
        set({ currentChats: [] });
        set({ isFetchingChats: true });
        if (get().selectedChat?.chatId) {
            const localMessages = await getMessages(get().selectedChat.chatId);
            const last15 = localMessages.slice(-MESSAGES_PER_PAGE);
            set({ currentChats: last15, hasMore: true });
        }
        try {
            const response = await axios.get(
                `/chats/get-chats?id=${get().selectedChat._id}&chatid=${
                    get().selectedChat.chatId
                }`
            );
            if (response?.data?.success) {
                const chats = response?.data?.messages;
                await updateMessagesById(get().selectedChat?.chatId, chats);
                const updatedLocal = await getMessages(
                    get().selectedChat?.chatId
                );
                set({ currentChats: updatedLocal });
            }
        } catch (error) {
            console.log("Failed to fetching chats - ", error.message);
        } finally {
            set({ isFetchingChats: false, hasMoreUsers: false });
        }
    },
    loadMoreMessages: async () => {
        const { currentChats, loadingMore, hasMore } = get();
        if (loadingMore || !hasMore) return;
        if (get().selectedChat === null) return;

        set({ loadingMore: true });
        try {
            const oldestTime = currentChats[0]?.createdAt;
            const response = await axios.get(
                `/chats/load-older-messages?chatid=${
                    get()?.selectedChat?.chatId
                }&before=${oldestTime}`
            );
            if (response?.data?.success && response.data.messages.length > 0) {
                set({
                    currentChats: [...response.data.messages, ...currentChats],
                    hasMore:
                        response.data.messages.length === MESSAGES_PER_PAGE,
                    loadingMore: false
                });
            } else {
                set({ hasMore: false, loadingMore: false });
            }
        } catch (error) {
            set({ loadingMore: false });
        } finally {
            set({ loadingMore: false, hasMore: false });
        }
    },
    loadMoreUsers: async () => {
        const { chatUsers, loadingMoreUsers, hasMoreUsers } = get();

        try {
            set({ loadingMoreUsers: true });
            const oldestTime = chatUsers.at(-1)?.time;
            const response = await axios.get(
                `/chats/get-old-chat-users?next=${oldestTime}`
            );
            const newUsers = response?.data.users || [];
            // const mergedUsers = [get().chatUsers, ...newUsers];
            set(state => ({
                chatUsers: [...state.chatUsers, ...newUsers],
                hasMoreUsers: newUsers.length > 0
            }));
            const filteredUsers = [
                ...new Map(get().chatUsers.map(i => [i._id, i])).values()
            ];
            set({ chatUsers: filteredUsers });
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ loadingMoreUsers: false });
        }
    },
    getChatUsers: async () => {
        let cachesUsers =
            JSON.parse(localStorage.getItem("inbox-user")) || null;
        set({ chatUsers: cachesUsers });
        set({ isLoadingUsers: true });
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
            const socketState = useSocket.getState();
            set({ isSendingMessage: true });
            let uploadedFiles = [];
            const tempId = Date.now()

            const newMessage = {
                sender: {
                    _id: useAuth.getState().user._id
                },
                receiver: get().selectedChat._id,
                text,
                files,
                seen: socketState?.onlineUsers?.includes(get().selectedChat._id)
                    ? "DELIVERED"
                    : "SENT",
                createdAt: new Date(Date.now()).toISOString(),
                tempId
            };
            set({
                currentChats: [...get().currentChats, newMessage]
            });
            if (socketState.connected) {
                socketState.sendMessage(get().selectedChat._id, newMessage);
            }
            if (files.length > 0) {
                uploadedFiles = await Promise.all(
                    files.map(fileObj => get().uploadFileChunks(fileObj))
                );
            }
            const response = await axios.post(
                `/chats/send-message?id=${get().selectedChat._id}&chatid=${
                    get().selectedChat.chatId
                }`,
                {
                    tempId,
                    text,
                    files: uploadedFiles
                }
            );
            if (response?.data?.success) {
                await saveMessages(
                    get().selectedChat.chatId,
                    response?.data?.newMessage
                );
                const updatedLocal = await getMessages(
                    get().selectedChat.chatId
                );
                // await get().getChatUsers();
               // set({ currentChats: updatedLocal });
               // console.log("NEW SENT MESSAGE - ", updatedLocal);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            set({ isSendingMessage: false });
        }
    },
    mergeMessage: async message => {
        set({
            currentChats: [...get().currentChats, message]
        });
        await get().getChatUsers();
        /*
        set(state => ({
            chatUsers: state.chatUsers.map(user => {
                if (user?._id === message?.sender?._id) {
                    return {
                        ...user,
                        lastMessage: message.text, // or message.text / message.content
                        updatedAt: Date.now() // optional but recommended
                    };
                }
                return user;
            })
        }));
*/
        // console.log("MERG MESSAGE : ", get().currentChats);
    },
    updateStatus: data => {
        set(state => ({
            currentChats: state.currentChats.map(chat =>
                chat.tempId === data.msgId
                    ? { ...chat, seen: data.status }
                    : chat
            )
        }));
        // console.log("UPDATED STATUS ", get().currentChats);
    }
}));

export default useChatStore;
