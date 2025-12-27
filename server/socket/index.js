const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const config = require("../configs");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: config.CORS_ORIGIN || "*",
    credentials: true,
  },
  transports: ["websocket"],
  pingTimeout: 30000,
  maxHttpBufferSize: 1e6,
});

/* =========================
   AUTH
========================= */
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

/* =========================
   CONNECTION
========================= */
io.on("connection", (socket) => {
  console.log(`[+] ${socket.username} connected`);

  // WhatsApp rule: 1 user = 1 room
  socket.join(socket.userId);

  socket.broadcast.emit("user:online", socket.userId);

  /* =========================
     SEND MESSAGE
  ========================= */
  socket.on("message:send", ({ to, message, tempId }) => {
    const payload = {
      _id: tempId,
      from: socket.userId,
      to,
      message,
      status: "sent",
      createdAt: new Date(),
    };

    // send to receiver room
    io.to(to).emit("message:receive", payload);

    // delivery ack
    socket.emit("message:delivered", {
      tempId,
      deliveredAt: new Date(),
    });
  });

  /* =========================
     READ RECEIPT
  ========================= */
  socket.on("message:read", ({ from }) => {
    io.to(from).emit("message:read", {
      by: socket.userId,
      at: new Date(),
    });
  });

  /* =========================
     TYPING
  ========================= */
  socket.on("typing:start", (to) => {
    socket.to(to).emit("typing:start", socket.userId);
  });

  socket.on("typing:stop", (to) => {
    socket.to(to).emit("typing:stop", socket.userId);
  });

  /* =========================
     DISCONNECT
  ========================= */
  socket.on("disconnect", () => {
    socket.broadcast.emit("user:offline", socket.userId);
    console.log(`[-] ${socket.username} disconnected`);
  });
});

module.exports = { express, app, server, io };
