const router = require("express").Router();
const authSignupController = require("../auth-controllers/auth-signup.controller");
const authLoginController = require("../auth-controllers/auth-login.controller");
const verifyOTPController = require("../auth-controllers/auth-otp-verify.controller");
const resendOTPController = require("../auth-controllers/resend-otp.controller");
const logoutController = require("../auth-controllers/auth-logout.controller");
const settingsController = require("../auth-controllers/auth-settings.controller");
const resetPasswordController = require("../auth-controllers/reset-password.controller");
const isAuth = require("../middlewares/is-auth")


router.post("/signup", authSignupController);
router.post("/login", authLoginController);
router.post("/verify-otp",isAuth, verifyOTPController);
router.post("/resend-otp", isAuth,resendOTPController);
router.post("/logout", isAuth,logoutController);
router.post("/reset-password", isAuth,resetPasswordController);
router.put("/save-settings", isAuth,settingsController);

module.exports = router;
