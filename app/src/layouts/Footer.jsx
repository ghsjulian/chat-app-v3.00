import React, { useEffect, useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import useMessage from "../store/useMessage";
import isValid from "../libs/is-valid-text";

const Footer = () => {
    const { sendMessage } = useMessage();
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);

    const handleFiles = (e) => {
        let files = e.target.files;
        if (!files || files?.length === 0) return;
        console.log(files);
    };

    return (
        <footer className="footer">
            <div className="input-wrapper">
                <label htmlFor="files">
                    <GrAttachment size={24} />
                </label>
                <input
                    onChange={handleFiles}
                    type="file"
                    id="files"
                    multiple={true}
                    hidden={true}
                />
                <input
                    ref={inputRef}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            if (!isValid(text)) return;
                            sendMessage({ text, file: file ?? null });
                            inputRef.current.focus();
                        }
                        return;
                    }}
                    onChange={e => setText(e.target.value)}
                    value={text}
                    type="text"
                    className="message-input"
                    placeholder="Aa"
                />
                <MdSend
                    onClick={() => {
                        if (!isValid(text)) return;
                        sendMessage({ text, file: file ?? null });
                    }}
                    size={24}
                />
            </div>
        </footer>
    );
};

export default Footer;
