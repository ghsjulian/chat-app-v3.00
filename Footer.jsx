import React, { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdSend } from "react-icons/md";
import axios from "axios";
//import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 6;

const Footer = () => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // { file, progress, uploadId }
  const textRef = useRef(null);
  const fileInputRef = useRef(null);

  // Select files
  const handleFiles = (e) => {
    let selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > MAX_FILES) {
      selectedFiles = selectedFiles.slice(0, MAX_FILES - files.length);
    }

    const filesWithMeta = selectedFiles.map((file) => ({
      file,
      progress: 0,
      uploadId: Date.now()//uuidv4(),
    }));

    setFiles((prev) => [...prev, ...filesWithMeta]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove file
  const removeFileAt = (index) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  // Upload a single file in chunks
  const uploadFileInChunks = async (fileObj) => {
    const { file, uploadId } = fileObj;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);

      await axios.post("http://localhost:5000/api/upload-chunk", chunk, {
        headers: {
          "Content-Type": "application/octet-stream",
          "fileName": file.name,
          "chunkIndex": i,
          "totalChunks": totalChunks,
          "uploadId": uploadId,
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.uploadId === uploadId
            ? { ...f, progress: Math.floor(((i + 1) / totalChunks) * 100) }
            : f
        )
      );
    }
  };

  // Upload all files in parallel
  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;

    try {
      // Upload all files in parallel
      await Promise.all(files.map((fileObj) => uploadFileInChunks(fileObj)));

      // Send text + uploaded file names to backend
      await axios.post("http://localhost:5000/chats/send-message", {
        text: text.trim(),
        files: files.map((f) => f.file.name),
      });

      setText("");
      setFiles([]);
      if (textRef.current) textRef.current.focus();
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <footer className="footer">
      {files.length > 0 && (
        <div className="selected-media">
          {files.map((f, idx) => {
            const ext = f.file.type ? f.file.type.split("/")[1] : f.file.name.split(".").pop();
            return (
              <div className="img" key={`${f.file.name}-${f.file.size}`}>
                <button className="close" onClick={() => removeFileAt(idx)} type="button">
                  &times;
                </button>
                <div className="av">{ext}</div>
                <div className="progress">{f.progress}%</div>
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
          multiple
          hidden
        />

        <input
          ref={textRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          className="message-input"
          placeholder="Aa"
        />

        <MdSend onClick={handleSend} size={24} style={{ cursor: "pointer" }} />
      </div>
    </footer>
  );
};

export default Footer;
