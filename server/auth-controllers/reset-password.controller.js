const userModel = require("../models/user.model");
const { createHash, compareHashed } = require("../functions/password-hashing");

const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body;
        if (!newPassword.trim() || !confirmNewPassword.trim())
            return res.status(403).json({
                success: false,
                message: "Password fields are required"
            });
        if (newPassword.trim() !== confirmNewPassword.trim())
            return res.status(403).json({
                success: false,
                message: "Passwords didn't match"
            });
        const user = await userModel.findById(req?.user?._id);
        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found in server"
            });
        const newHashed = await createHash(newPassword.trim());
        await userModel.findByIdAndUpdate(req?.user?._id, {
            password: newHashed
        });
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected server error - 505"
        });
    }
};
module.exports = resetPassword;
