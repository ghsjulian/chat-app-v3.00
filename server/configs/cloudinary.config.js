const cloudinary = require("cloudinary").v2;
const config = require("../configs/index");

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true
});

// 🔹 Upload Function
const Uploader = async (imgPath, id) => {
    try {
        const results = await cloudinary.uploader.upload(imgPath, {
            folder: "chat-app-v3",
            public_id: id
        });
        return results;
    } catch (error) {
        console.log("Error in Uploader -", error);
        throw error;
    }
};

// 🔹 Delete Function
const DeleteFile = async publicId => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.log("Error in DeleteFile -", error);
        throw error;
    }
};

const uploadBase64PDF = async base64String => {
    if (!base64String.startsWith("data:application/pdf;base64,")) {
        throw new Error("Invalid base64 PDF format");
    }
    // Upload as raw file
    return await cloudinary.uploader.upload(base64String, {
        resource_type: "raw",
        folder: "pdf_uploads",
        format: "pdf",
        public_id: `pdf_${Date.now()}`
    });
};

const deletePDF = async publicId => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw"
    });
};

module.exports = { Uploader, DeleteFile, deletePDF, uploadBase64PDF };
