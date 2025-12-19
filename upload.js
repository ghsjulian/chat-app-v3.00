import { create } from "zustand";
import axios from "axios";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RETRY = 3;

export const useUploadStore = create((set, get) => ({

    isSendingMessage: false,
    uploadProgress: {}, // { uploadId: percent }

    uploadFileChunks: async (fileObj) => {
        const { file, uploadId, uploadedChunks = 0 } = fileObj;

        if (!file || !uploadId) {
            throw new Error("Invalid file object");
        }

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let chunkIndex = uploadedChunks; chunkIndex < totalChunks; chunkIndex++) {
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
                            headers: { "Content-Type": "application/octet-stream" },
                            timeout: 0,
                        }
                    );

                    success = true;

                    set(state => ({
                        uploadProgress: {
                            ...state.uploadProgress,
                            [uploadId]: Math.round(((chunkIndex + 1) / totalChunks) * 100),
                        },
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
            uploadId,
            name: file.name,
            size: file.size,
        };
    },

    sendMessage: async (files , text) => {
        try {
            set({ isSendingMessage: true });

            let uploadedFiles = [];

            if (files.length > 0) {
                uploadedFiles = await Promise.all(
                    files.map(fileObj => get().uploadFileChunks(fileObj))
                );
            }

            await axios.post(`/chats/send-message?id=${chatId}`, {
                text,
                files: uploadedFiles,
            });

        } catch (err) {
            console.error(err.message);
        } finally {
            set({ isSendingMessage: false });
        }
    }
}));