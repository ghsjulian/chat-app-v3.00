const userModel = require("../models/user.model");
const setCookie = require("../functions/set.cookie");
const { createJWT, decodeJWT } = require("../functions/jwt-token-generator");
const { createHash, compareHashed } = require("../functions/password-hashing");
const { Uploader, DeleteFile } = require("../configs/cloudinary.config");
const sendMail = require("../configs/mailer.config");
const getPublicId = require("../functions/public-id-generator");
const genOTP = require("../functions/gen-otp");

const authSignupController = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;
        if (!name && !email && !password && !avatar)
            return res
                .status(403)
                .json({ success: false, message: "All fields are required" });
        const existUser = await userModel.findOne({
            email: email.trim()
        });
        if (existUser) throw new Error("User Already Registered");
        const hash = await createHash(password.trim());
        /*
        const uploadResult = await Uploader(avatar, getPublicId());
        let avatar_obj = {
            public_id: uploadResult.public_id,
            img_url: uploadResult.secure_url
        };
        */
        const newUser = new userModel({
            name,
            email,
            password: hash,
            avatar: {}, //avatar_obj
            isVerified: false
        });
        const token = await createJWT({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        });
        const otp = genOTP();
        newUser.otp = {
            value: otp,
            expiresIn: new Date(Date.now() + 75 * 1000),
            atempts: 0
        };
        await newUser.save();
        await setCookie(res, token);
        // await sendMail(otp)
        // Send Otp and complete the signup
        const user = await userModel.findOne({email : email.trim()}).select("-password -otp")
        return res.status(201).json({
            user,
            access_token : token,
            success : true,
            message : "User Registration Successfully"
        });
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = authSignupController;
