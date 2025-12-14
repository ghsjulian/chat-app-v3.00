const userModel = require("../models/user.model");

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp)
            return res
                .status(400)
                .json({ success: false, message: "Email and OTP required" });
        const user = await userModel.findOne({
            email
        });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        if (!user.otp)
            return res
                .status(400)
                .json({ success: false, message: "No OTP pending" });
        if (user.isVerified)
            return res
                .status(400)
                .json({ success: false, message: "User already verified" });
        // Check expiry
        if (user.otp.expiresIn < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one."
            });
        }
        if (user.otp.value !== otp.trim())
            return res.status(403).json({
                success: false,
                message: "Invalid OTP, OTP didn't match"
            });
        if (user.otp.value === otp.trim()) {
            await userModel.findByIdAndUpdate(user._id, {
                isVerified: true
            });
            return res.status(200).json({
                success: true,
                message: "OTP Verification Successfully"
            });
        }
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = verifyOTP;
