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
            isAvatar,
            oldPassword,
            newPassword
        } = req.body;

        const existUser = await userModel.findById(req?.user?._id);
        if (!existUser)
            return res.status(404).json({ success: false, message: "User not found" });

        let imgObject = existUser.avatar;
        let newHashed;

        /* -------- PASSWORD UPDATE -------- */
        if (isChangingPassword) {
            if (!oldPassword?.trim() || !newPassword?.trim())
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
                    message: "Invalid old password"
                });

            newHashed = await createHash(newPassword.trim());
        }

        /* -------- AVATAR UPDATE -------- */
        if (isAvatar && avatar) {
            const uploadResult = await Uploader(avatar, getPublicId());
            imgObject = {
                public_id: uploadResult.public_id,
                img_url: uploadResult.secure_url
            };

            if (existUser?.avatar?.public_id)
                await DeleteFile(existUser.avatar.public_id);
        }

        /* -------- UPDATE OBJECT (ONLY CHANGED FIELDS) -------- */
        const newData = {
            avatar: imgObject,
            ...(name && { name }),
            ...(email && { email }),
            ...(newHashed && { password: newHashed })
        };

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            newData,
            { new: true }
        );

        const user = await userModel
            .findById(updatedUser._id)
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
        return res.status(500).json({
            success: false,
            message: error.message || "Unexpected server error"
        });
    }
};

module.exports = settingsController;
