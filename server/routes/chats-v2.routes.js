const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const findUsers = require("../chat-controller-v2/find-users.controller")
const uploadChunks = require("../chat-controller-v2/upload-chunks.controller");
const sendMessage = require("../chat-controller-v2/send-message.controller");
const getMessages = require("../chat-controller-v2/get-messages.controller");
const loadOlderMessages = require("../chat-controller-v2/load-older-message.controller");
const loadOlderUsers = require("../chat-controller-v2/load-users.controller");

router.get(
    "/get-chat-users",
    express.json({ limit: "1025mb" }),
    isAuth,
    findUsers
);
router.get("/get-chats", express.json({ limit: "1025mb" }), isAuth, getMessages);
router.post(
    "/upload-chunks",
    isAuth,
    uploadChunks
);
router.post(
    "/send-message",
    express.json({ limit: "1025mb" }),
    isAuth,
    sendMessage
);
router.get(
    "/load-older-messages",
    isAuth,
    loadOlderMessages
);
router.get(
    "/get-old-chat-users",
    isAuth,
    loadOlderUsers
);


module.exports = router