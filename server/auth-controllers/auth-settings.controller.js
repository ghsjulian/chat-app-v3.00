const userModel = require("../models/user.model");
const setCookie = require("../functions/set.cookie");
const { createHash, compareHashed } = require("../functions/password-hashing");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const getPublicId = require("../functions/public-id-generator");
const { createJWT } = require("../functions/jwt-token-generator");

const settingsController = async (req, res) => {
    try {
        const {
            avatar,
            name,
            email,
            isChangingPassword,
            oldPassword,
            newPassword
        } = req.body;
        const imageType = typeof avatar;
        let imgObject = {};
        let newHashed = "";

        if (!name && !email && !avatar)
            return res
                .status(403)
                .json({ success: false, message: "All fields are required" });
        const existUser = await userModel.findById(req?.user?._id);
        if (isChangingPassword) {
            if (!oldPassword.trim() || !newPassword.trim())
                return res.status(403).json({
                    success: false,
                    message: "Password fields are required"
                });
            const isMatched = await compareHashed(
                oldPassword.trim(),
                existUser.password
            );
            if (!isMatched)
                return res.status(403).json({
                    success: false,
                    message: "Invalid user email or password"
                });
            newHashed = await createHash(newPassword.trim());
        }

        if (imageType === "string") {
            // When i will have data
            /*
            const uploadResult = await Uploader(avatar, getPublicId());
            imgObject = {
                public_id: uploadResult.public_id,
                img_url: uploadResult.secure_url
            };
            await DeleteFile(user.avatar.public_id);
            */
            // But I'm offline
            imgObject = {
                test: "ghs"
            };
        } else {
            imgObject = existUser.avatar;
        }
        const newData = {
            avatar: imgObject,
            name,
            email,
            password: newHashed
        };
        const updatedData = await userModel.findByIdAndUpdate(
            req.user._id,
            newData
        );
        const user = await userModel
            .findOne({ email: email.trim() })
            .select("-password -otp");
        const token = await createJWT({
            _id: user._id,
            name: user.name,
            email: user.email
        });
        await setCookie(res, token);
        return res.status(201).json({
            user,
            access_token: token,
            success: true,
            message: "Settings Saved Successfully"
        });
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected server error - 505"
        });
    }
};

module.exports = settingsController;
