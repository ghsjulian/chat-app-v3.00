const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const config = require("../configs");
const messageModel = require("../models/message.model");
const app = express();
const server = http.createServer(app);

/**
 * Store only ONLINE userIds
 */
const onlineUsers = {};

const io = new Server(server, {
    path: "/socket.io",
    cors: {
        origin: config.CORS_ORIGIN || "*",
        credentials: true
    },
    transports: ["websocket"],
    pingTimeout: 30000,
    maxHttpBufferSize: 1e6
});

/* ===============================
   AUTH MIDDLEWARE
================================ */

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        socket.userId = token._id;
        socket.username = token.name;

        next();
    } catch {
        next(new Error("Invalid token"));
    }
});

/* ===============================
   CONNECTION
================================ */

io.on("connection", socket => {
    const { userId, username } = socket;

    console.log(`[+] ${username} connected → ${socket.id}`);

    // One user = one room (multi-device safe)
    socket.join(userId);

    /* ===============================
       ONLINE STATUS
    ================================ */

    onlineUsers[userId] = socket.id;
    // Send current online users to this socket
    io.emit("users:online:list", Object.keys(onlineUsers));
    /* ===============================
       MESSAGING
    ================================ */

    socket.on("message:send", ({ to, message }) => {
        io.to(to).emit("message:receive", message);
    });

    socket.on("message:read", async ({ from, msgId, status }) => {
        io.to(from).emit("message:read", {
            from,
            msgId,
            status
        });
        await messageModel.updateOne(
  { tempId: msgId },
  { $set: { seen: status } }
);
    });

    socket.on("typing:start", to => {
        socket.to(to).emit("typing:start", userId);
    });

    socket.on("typing:stop", to => {
        socket.to(to).emit("typing:stop", userId);
    });

    /* ===============================
       DISCONNECT
    ================================ */

    socket.on("disconnect", () => {
        console.log(`[-] ${username} disconnected → ${socket.id}`);

        // Check remaining sockets in user's room
        const room = io.sockets.adapter.rooms.get(userId);

        // If no sockets left → user is offline
        if (!room || room.size === 0) {
            delete onlineUsers[userId];
            io.emit("user:offline", Object.keys(onlineUsers));
        }
    });
});

module.exports = { express, app, server, io, onlineUsers };
