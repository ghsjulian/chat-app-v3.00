const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Upload folder
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Helper to sanitize file names
const sanitizeFileName = (name) => path.basename(name.replace(/\s/g, "_"));

// --- Check uploaded chunks (resumable support) ---
app.get("/api/upload-status", (req, res) => {
  const { uploadid, filename } = req.query;
  if (!uploadid || !filename) return res.status(400).json({ success: false });

  const tempFile = path.join(UPLOAD_DIR, `${uploadid}_${sanitizeFileName(filename)}`);
  if (!fs.existsSync(tempFile)) return res.json({ uploadedChunks: 0 });

  const stats = fs.statSync(tempFile);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
  const uploadedChunks = Math.floor(stats.size / CHUNK_SIZE);
  return res.json({ uploadedChunks });
});

// --- Upload file chunk ---
app.post("/api/upload-chunk", (req, res) => {
  const fileName = sanitizeFileName(req.headers["filename"]);
  const chunkIndex = parseInt(req.headers["chunkindex"]);
  const totalChunks = parseInt(req.headers["totalchunks"]);
  const uploadId = req.headers["uploadid"];

  if (!fileName || isNaN(chunkIndex) || isNaN(totalChunks) || !uploadId) {
    return res.status(400).json({ success: false, message: "Missing headers" });
  }

  const tempFilePath = path.join(UPLOAD_DIR, `${uploadId}_${fileName}`);

  // Append chunk using streams (non-blocking)
  const writeStream = fs.createWriteStream(tempFilePath, { flags: "a" });
  req.pipe(writeStream);

  writeStream.on("finish", () => {
    if (chunkIndex + 1 === totalChunks) {
      console.log(`Upload complete: ${fileName}`);
      return res.json({ success: true, message: "File uploaded successfully" });
    } else {
      return res.json({ success: true, message: `Chunk ${chunkIndex} uploaded` });
    }
  });

  writeStream.on("error", (err) => {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  });
});

// --- Optional endpoint to handle "message" after files uploaded ---
app.post("/chats/send-message", (req, res) => {
  // In real scenario, handle saving message with uploaded files info
  return res.json({ success: true, message: "Message received!" });
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
