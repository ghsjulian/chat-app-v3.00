const userModel = require("../models/user.model");
const setCookie = require("../functions/set.cookie");
const { createJWT } = require("../functions/jwt-token-generator");
const { compareHashed } = require("../functions/password-hashing");


const authLoginController = async(req,res)=>{
    try {
        const {email, password} = req.body;
        if (!email && !password)
            return res
                .status(403)
                .json({ success: false, message: "All fields are required" });
        const existUser = await userModel.findOne({
            email: email.trim()
        });
        if (!existUser) return res.status(403).json({ success : false,message : "Invalid user email or password"});
        const isMatched = await compareHashed(password.trim(),existUser.password);
        if(!isMatched) return res.status(403).json({ success : false,message : "Invalid user email or password"});
       const token = await createJWT({
            _id: existUser._id,
            name: existUser.name,
            email: existUser.email
        });
        await setCookie(res, token);
        const user = await userModel.findOne({email : email.trim()}).select("-password -otp")
        return res.status(201).json({
            user,
            access_token : token,
            success : true,
            message : "User Logged In Successfully"
        });
    } catch (error) {
        return res.status(505).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
}

module.exports = authLoginController