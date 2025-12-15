const userModel = require("../models/user.model");
const { decodeJWT } = require("../functions/jwt-token-generator");

const isAuth = async (req, res, next) => {
    try {
        const token = req?.cookies?.chatappv3 || null;
        if (token === null) throw new Error("No token provided");
        const decoded = await decodeJWT(token);
        if (!decoded || decoded === null)
            throw new Error("Unauthorized - invalid user token");
        // check if user exists in DB or has admin role (optional)
        const user = await userModel.findById(decoded._id).select("-password");
        if (!user) throw new Error("User not found");
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = isAuth;
