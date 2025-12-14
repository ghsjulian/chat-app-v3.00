const userModel = require("../models/user.model");
const sendMail = require("../configs/mailer.config");
const getPublicId = require("../functions/public-id-generator");
const genOTP = require("../functions/gen-otp");

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email.trim() === "")
            return res
                .status(400)
                .json({ success: false, message: "Email is required" });
        const user = await userModel.findOne({
            email: email.trim()
        });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        if (user.isVerified)
            return res
                .status(400)
                .json({ success: false, message: "User already verified" });
        const otp = genOTP();
        await userModel.findByIdAndUpdate(user._id, {
            otp: {
                value: otp,
                expiresIn: new Date(Date.now() + 75 * 1000), // 1 minutes 
                atempts: 0
            }
        });
        // Send The OTP In email
        //await sendMail(otp)
        return res.status(200).json({
            success: true,
            message: "OTP Sent To Your Email"
        });
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = resendOTP;
