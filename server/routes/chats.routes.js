const router = require("express").Router()
const isAuth = require("../middlewares/is-auth")
const chatUsersController = require("../chat-controllers/chat-users.controller")

router.get("/get-chat-users",isAuth,chatUsersController);

module.exports = router