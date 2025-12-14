import React, { useEffect, useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import useMessage from "../store/useMessage";
import isValid from "../libs/is-valid-text";

const Footer = () => {
    const { sendMessage } = useMessage();
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]); // flat array of File objects
    const textRef = useRef(null);
    const fileInputRef = useRef(null);
    const MAX_FILES = 6;

    // Helper: avoid duplicates by name + size
    const mergeFiles = (existing, incoming) => {
        const existingKeys = new Set(existing.map(f => `${f.name}-${f.size}`));
        const filteredIncoming = incoming.filter(
            f => !existingKeys.has(`${f.name}-${f.size}`)
        );
        return [...existing, ...filteredIncoming];
    };

    const handleFiles = e => {
        const fl = e.target.files;
        if (!fl || fl.length === 0) return;

        const incoming = Array.from(fl);

        // Merge while preventing duplicates
        let merged = mergeFiles(files, incoming);

        // Enforce max limit
        if (merged.length > MAX_FILES) {
            merged = merged.slice(0, MAX_FILES);
            // optional: inform user they hit limit
            // alert(`Maximum ${MAX_FILES} files allowed`);
            console.warn(
                `Maximum ${MAX_FILES} files allowed — extras were ignored.`
            );
        }

        setFiles(merged);

        // Reset file input so selecting the same file again will trigger onChange
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFileAt = index => {
        setFiles(prev => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    const handleSend = () => {
        if (!isValid(text) && files.length === 0) return;
        // send Message object containing text and files array (or null)
        sendMessage({
            text: isValid(text) ? text : "",
            files: files.length ? files : null
        });
        setText("");
        setFiles([]);
        if (textRef.current) textRef.current.focus();
    };

    return (
        <footer className="footer">
            {files.length > 0 && (
                <div className="selected-media">
                    {files.map((f, idx) => {
                        const ext = f.type
                            ? f.type.split("/")[1]
                            : f.name.split(".").pop();
                        return (
                            <div className="img" key={`${f.name}-${f.size}`}>
                                <button
                                    className="close"
                                    onClick={() => removeFileAt(idx)}
                                    type="button"
                                    aria-label={`Remove ${f.name}`}
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
                    <GrAttachment size={24} />
                </label>

                <input
                    ref={fileInputRef}
                    onChange={handleFiles}
                    type="file"
                    id="files"
                    multiple={true}
                    hidden={true}
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
                    placeholder="Aa"
                />

                <MdSend
                    onClick={handleSend}
                    size={24}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </footer>
    );
};

export default Footer;
