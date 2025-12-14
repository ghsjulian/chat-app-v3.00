const jwt = require("jsonwebtoken");
const config = require("../configs/index")

const createJWT = async payload => {
    const secretKey = config.SECRET_KEY;
    const expiresIn = config.EXPIRES_IN;
    return jwt.sign(payload, secretKey, { expiresIn });
};
const decodeJWT = async token => {
    try {
        const secretKey = logger.SECRET_KEY;
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
};
const setCookie = async (res, value) => {
    res.cookie("chatappv3", value, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httponly: true,
        sameSite: "strict",
        secure: config.NODE_ENV !== "development"
    });
    return true;
};
module.exports = { createJWT, decodeJWT ,setCookie};
