"use strict";

const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(path.join(__dirname, "../temp"));
const FINAL_DIR = path.join(path.join(__dirname, "../uploads"));

// Ensure folders exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

const uploadChunks = async (req, res) => {
    try {
        const { uploadid, chunkindex, totalchunks, filename } = req.query;

        if (
            !uploadid ||
            chunkindex === undefined ||
            !totalchunks ||
            !filename
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters"
            });
        }

        const chunkIndex = Number(chunkindex);
        const totalChunks = Number(totalchunks);

        if (
            Number.isNaN(chunkIndex) ||
            Number.isNaN(totalChunks) ||
            chunkIndex < 0 ||
            chunkIndex >= totalChunks
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chunk data"
            });
        }

        const chunkDir = path.join(TEMP_DIR, uploadid);
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir, { recursive: true });
        }

        const chunkPath = path.join(chunkDir, String(chunkIndex));
        const writeStream = fs.createWriteStream(chunkPath, { flags: "w" });

        // ---------------- WRITE CHUNK ----------------
        req.pipe(writeStream);

        req.on("aborted", () => writeStream.destroy());

        writeStream.on("error", err => {
            console.error("Chunk write error:", err);
            return res.status(500).json({ success: false });
        });

        writeStream.on("finish", async () => {
            // ---------------- CHECK IF ALL CHUNKS EXIST ----------------
            const uploadedChunks = fs.readdirSync(chunkDir).length;

            if (uploadedChunks !== totalChunks) {
                return res.json({
                    success: true,
                    merged: false,
                    chunkIndex
                });
            }

            // ---------------- MERGE ----------------
            const finalFilePath = path.join(
                FINAL_DIR,
                `${uploadid}${path.extname(filename)}`
            );

            const finalWriteStream = fs.createWriteStream(finalFilePath);

            for (let i = 0; i < totalChunks; i++) {
                const chunkFile = path.join(chunkDir, String(i));
                await new Promise((resolve, reject) => {
                    const readStream = fs.createReadStream(chunkFile);
                    readStream.pipe(finalWriteStream, { end: false });
                    readStream.on("end", resolve);
                    readStream.on("error", reject);
                });
            }

            finalWriteStream.end();

            // ---------------- CLEANUP ----------------
            finalWriteStream.on("close", () => {
                fs.rmSync(chunkDir, { recursive: true, force: true });

                return res.json({
                    success: true,
                    merged: true,
                    file: {
                        name: uploadid+path.extname(filename),
                        ext : path.extname(filename),
                        path: `/uploads/${uploadid}${path.extname(filename)}`
                    }
                });
            });
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
            success: false,
            message: "Upload failed"
        });
    }
};

module.exports = uploadChunks;
