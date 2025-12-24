import React, { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
//import { v4 as uuidv4 } from "uuid";
import useChat from "../store/useChat";
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 6;

const Footer = () => {
    const { sendMessage, isSendingMessage } = useChat();
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]); // { file, progress, uploadId }
    const textRef = useRef(null);
    const fileInputRef = useRef(null);

    // Select files
    const handleFiles = e => {
        let selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > MAX_FILES) {
            selectedFiles = selectedFiles.slice(0, MAX_FILES - files.length);
        }

        const filesWithMeta = selectedFiles.map(file => ({
            file,
            progress: 0,
            uploadId: Date.now() //uuidv4(),
        }));

        setFiles(prev => [...prev, ...filesWithMeta]);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Remove file
    const removeFileAt = index => {
        setFiles(prev => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    // Upload all files in parallel
    const handleSend = async () => {
        if (!text.trim() && files.length === 0) return;
        if (isSendingMessage) return;
        let trimdText = text.trim()
        let finalFiles = files

        setText("");
        setFiles([]);
        if (textRef.current) textRef.current.focus();
        await sendMessage(files, trimdText);
    };

    return (
        <footer className="footer">
            {files.length > 0 && (
                <div className="selected-media">
                    {files.map((f, idx) => {
                        const ext = f.file.type
                            ? f.file.type.split("/")[1]
                            : f.file.name.split(".").pop();
                        return (
                            <div
                                className="img"
                                key={`${f.file.name}-${f.file.size}`}
                            >
                                <button
                                    className="close"
                                    onClick={() => removeFileAt(idx)}
                                    type="button"
                                >
                                    &times;
                                </button>
                                <div className="av">{ext}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="input-wrapper">
                <label htmlFor="files">
                    <FaPlus size={27} />
                </label>

                <input
                    ref={fileInputRef}
                    onChange={handleFiles}
                    type="file"
                    id="files"
                    multiple
                    hidden
                />

                <input
                    ref={textRef}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    onChange={e => setText(e.target.value)}
                    value={text}
                    type="text"
                    className="message-input"
                    placeholder="Aa : Type Message..."
                />

                <MdSend
                    onClick={handleSend}
                    size={36}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </footer>
    );
};

export default Footer;
