import { create } from "zustand";
import axios from "../libs/axios";
import useAuth from "./useAuth";
import useApp from "./useApp";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRY = 3;
const useChat = create((set, get) => ({
    selectedChat: null,
    chatUsers: [],
    chats: [],
    isLoadingUsers: false,
    isFetchingChats: false,
    isSendingMessage: false,
    uploadProgress: {},

    getChat: async id => {
        set({ isFetchingChats: true });
        try {
            const response = await axios("/chats/get-chats?id=" + id);
            if (response?.data?.success) {
                set({ selectedChat: response?.data?.user,
                    chats : response?.data?.messages
                });
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            set({ isFetchingChats: false });
        }
    },
    renderUsers: async (term, filter = {}) => {
        set({ isLoadingUsers: true });
        try {
            const response = await axios.get(
                `/chats/get-chat-users?term=${term}&limit=10`
            );
            if (response?.data?.success) {
                set({ chatUsers: response?.data?.users });
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
                sender: 1, // useAuth.getState().user._id,
                receiver: 3, // get().selectedChat._id,
                text,
                files
            };
            set({
                chats: [...get().chats, newMessage]
            });

            if (files.length > 0) {
                uploadedFiles = await Promise.all(
                    files.map(fileObj => get().uploadFileChunks(fileObj))
                );
            }

            await axios.post(
                `/chats/send-message?id=${get().selectedChat._id}`,
                {
                    text,
                    files: uploadedFiles
                }
            );
        } catch (err) {
            console.error(err.message);
        } finally {
            set({ isSendingMessage: false });
        }
    }
}));

export default useChat;
