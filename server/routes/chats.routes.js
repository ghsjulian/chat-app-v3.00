const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const chatUsersController = require("../chat-controllers/chat-users.controller");
const getChats = require("../chat-controllers/get-chats.controller");
const sendMessage = require("../chat-controllers/send-message.controller");
const uploadChunks = require("../chat-controllers/upload-chunks.controller");

router.get(
    "/get-chat-users",
    express.json({ limit: "1025mb" }),
    isAuth,
    chatUsersController
);
router.get("/get-chats", express.json({ limit: "1025mb" }), isAuth, getChats);
router.post(
    "/send-message",
    express.json({ limit: "1025mb" }),
    isAuth,
    sendMessage
);
router.post(
    "/upload-chunks",
    isAuth,
    uploadChunks
);

module.exports = router;
