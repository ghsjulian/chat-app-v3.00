import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({}); // { fileName: % }

  const handleFiles = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const getUploadedChunks = async (file, uploadId) => {
    const res = await axios.get("http://localhost:5000/api/upload-status", {
      params: { filename: file.name, uploadid: uploadId },
    });
    return res.data.uploadedChunks || 0;
  };

  const uploadFile = async (file) => {
    const uploadId = uuidv4();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const startChunk = await getUploadedChunks(file, uploadId);

    for (let i = startChunk; i < totalChunks; i++) {
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

      setProgress((prev) => ({
        ...prev,
        [file.name]: Math.floor(((i + 1) / totalChunks) * 100),
      }));
    }
  };

  const handleUpload = async () => {
    for (const file of files) {
      await uploadFile(file);
    }
    alert("All files uploaded successfully!");
    setFiles([]);
    setProgress({});
  };

  const removeFile = (name) => {
    setFiles(files.filter((f) => f.name !== name));
    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resumable Chunked File Uploader</h2>
      <input type="file" multiple onChange={handleFiles} />
      <div style={{ marginTop: "10px" }}>
        {files.map((file) => (
          <div key={file.name} style={{ marginBottom: "10px" }}>
            {file.name} - {progress[file.name] || 0}%
            <button onClick={() => removeFile(file.name)} style={{ marginLeft: "10px" }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      {files.length > 0 && (
        <button onClick={handleUpload} style={{ marginTop: "20px" }}>
          Upload Files
        </button>
      )}
    </div>
  );
}
