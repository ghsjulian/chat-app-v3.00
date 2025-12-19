const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * COMPANY GRADE UPLOADER
 * Supports normal upload + chunk upload
 */
const uploader = ({
  uploadDir = "uploads",
  chunkDir = "uploads/chunks",
  maxSizeMB = 50,
  allowedTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4"]
} = {}) => {

  // Ensure directories exist
  [uploadDir, chunkDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // chunk upload check
      if (req.body?.isChunk === "true") {
        return cb(null, chunkDir);
      }
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const {
        chunkIndex,
        fileId,
        originalName
      } = req.body;

      // chunk file naming
      if (req.body?.isChunk === "true") {
        return cb(null, `${fileId}_${chunkIndex}`);
      }

      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024
    }
  });
};

/**
 * Merge chunks into final file
 */
const mergeChunks = async ({
  fileId,
  totalChunks,
  originalName,
  uploadDir = "uploads",
  chunkDir = "uploads/chunks"
}) => {
  const finalPath = path.join(uploadDir, originalName);
  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, `${fileId}_${i}`);
    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
    fs.unlinkSync(chunkPath);
  }

  writeStream.end();
  return finalPath;
};

module.exports = {
  uploader,
  mergeChunks
};
