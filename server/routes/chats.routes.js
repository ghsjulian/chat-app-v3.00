const router = require("express").Router()
const isAuth = require("../middlewares/is-auth")
const chatUsersController = require("../chat-controllers/chat-users.controller")
const getChats = require("../chat-controllers/get-chats.controller")
const sendMessage = require("../chat-controllers/send-message.controller")
const uploadChunks = require("../chat-controllers/upload-chunks.controller")

router.get("/get-chat-users",isAuth,chatUsersController);
router.get("/get-chats",isAuth,getChats);
router.post("/send-message",isAuth,sendMessage);
router.post("/upload-chunks",isAuth,uploadChunks);

module.exports = router