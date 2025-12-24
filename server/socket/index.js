const { Server } = require("socket.io");
const express = require("express");
const app = express();
const http = require("node:http");
const server = http.createServer(app);
const config = require("../configs/index");

const IO = new Server(server, {
    path: "/socket.io",
    cors: {
        origin: config.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    pingTimeout: 30000,
    maxHttpBufferSize: 1e6 // limit message size to 1MB
});

IO.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token || socket.handshake.query?.token;
        socket.user = token ? { id: token } : null;
        return next();
    } catch (error) {
        console.log("\n[!] Socket authentication failed", { error });
        return next(new Error("Authentication error"));
    }
});

IO.on("connection", socket => {
    console.log("\n[+] Socket connected", {
        id: socket.id,
        user: socket.user
    });

    socket.on("disconnect", reason => {
        console.log("Socket disconnected", { id: socket.id, reason });
    });
});

module.exports = {express,app,IO,server}

/*
/* ================================
   SOCKET CONNECTION
================================ */
/*
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // personal room (IMPORTANT)
  socket.join(socket.userId.toString());

  /* ================================
     INIT CHAT (1 to 1)
  ================================ */
/*
socket.on("chat:init", async (receiverId, cb) => {
    let chat = await Chat.findOne({
        participants: { $all: [socket.userId, receiverId] }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [socket.userId, receiverId]
        });
    }

    socket.join(chat._id.toString());
    cb(chat);
});

/* ================================
     SEND MESSAGE
  ================================ */
/*
  socket.on("message:send", async ({ chatId, receiverId, text }) => {

    const message = await Message.create({
      chatId,
      senderId: socket.userId,
      receiverId,
      text
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    // send to chat room
    io.to(chatId).emit("message:new", message);

    // notify receiver (even if chat closed)
    io.to(receiverId.toString()).emit("message:notify", message);
  });

  /* ================================
     MESSAGE SEEN
  ================================ */
/*
  socket.on("message:seen", async (chatId) => {

    await Message.updateMany(
      { chatId, receiverId: socket.userId, seen: false },
      { seen: true }
    );

    socket.to(chatId).emit("message:seen", socket.userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});
*/
