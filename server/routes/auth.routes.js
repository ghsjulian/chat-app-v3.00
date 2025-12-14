const router = require("express").Router();
const authSignupController = require("../auth-controllers/auth-signup.controller");
const authLoginController = require("../auth-controllers/auth-login.controller");
const verifyOTPController = require("../auth-controllers/auth-otp-verify.controller");
const resendOTPController = require("../auth-controllers/resend-otp.controller");
const logoutController = require("../auth-controllers/auth-logout.controller");

router.post("/signup", authSignupController);
router.post("/login", authLoginController);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);
router.post("/logout", logoutController);

module.exports = router;
