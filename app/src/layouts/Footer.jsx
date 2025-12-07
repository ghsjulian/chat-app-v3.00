import React, { useEffect, useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import useMessage from "../store/useMessage";
import isValid from "../libs/is-valid-text";

const Footer = () => {
  const { sendMessage } = useMessage();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [totalFiles, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    let files = e.target.files;
    if (!files || files?.length === 0) return;
    if (files.length >= 6 && totalFiles.length >= 6)
      throw new Error("Max file size 6");
    if (files.length > 0) {
      // setFormData((prev) => ({ ...prev, [id]: value }));
      // setFiles(Array.from(files));
      setFiles((prev) => [...prev, Array.from(files)]);
      console.log(totalFiles);
    }
  };

  return (
    <footer className="footer">
      {totalFiles && totalFiles?.length > 0 && (
        <div className="selected-media">
          {totalFiles?.map((file) => {
            return (
              <div className="img">
                <button className="close">x</button>
                <div className="av">{file.type.split("/")[1]}</div>
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
          onChange={handleFiles}
          type="file"
          id="files"
          multiple={true}
          hidden={true}
        />
        <input
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              if (!isValid(text)) return;
              sendMessage({ text, files: totalFiles ?? null });
              inputRef.current.focus();
            }
            return;
          }}
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          className="message-input"
          placeholder="Aa"
        />
        <MdSend
          onClick={() => {
            if (!isValid(text)) return;
            sendMessage({ text, files: totalFiles ?? null });
          }}
          size={24}
        />
      </div>
    </footer>
  );
};

export default Footer;
