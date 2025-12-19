const router = require("express").Router()
const isAuth = require("../middlewares/is-auth")
const chatUsersController = require("../chat-controllers/chat-users.controller")
const getChats = require("../chat-controllers/get-chats.controller")
const sendMessage = require("../chat-controllers/send-message.controller")

router.get("/get-chat-users",isAuth,chatUsersController);
router.get("/get-chats",isAuth,getChats);
router.post("/send-message",isAuth,sendMessage);

module.exports = router