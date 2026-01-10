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
    credentials: true,
  },
  transports: ["websocket"],
  pingTimeout: 30000,
  maxHttpBufferSize: 1e6,
});

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

io.on("connection", (socket) => {
  const { userId, username } = socket;

  console.log(`\n[+] ${username} connected → ${socket.id}\n`);

  // One user = one room (multi-device safe)
  socket.join(userId);
  onlineUsers[userId] = socket.id;
  // Send current online users to this socket
  io.emit("users:online:list", Object.keys(onlineUsers));

  socket.on("message:send", ({ to, message }) => {
    io.to(to).emit("message:receive", message);
  });

  socket.on("message:read", async ({ from, msgId, status }) => {
    // await messageModel.updateOne({ tempId: msgId }, { $set: { seen: status } });
    const updatedMessage = await messageModel.findOneAndUpdate(
      { tempId: msgId },
      { $set: { seen: status } },
      { new: true }
    );

    io.to(from).emit("message:read-success", {
      from,
      msgId,
      status,
      updatedMessage,
    });
  });

  socket.on("typing:start", (to) => {
    socket.to(to).emit("typing:start", userId);
  });

  socket.on("typing:stop", (to) => {
    socket.to(to).emit("typing:stop", userId);
  });
  socket.on("delivery:status", async (users) => {
    try {
      let updatedResult;
      updatedResult = await Promise.all(
        users.map((user) =>
          messageModel.updateOne(
            { _id: user.msgId },
            { $set: { seen: "DELIVERED" } }
          )
        )
      );
      users?.forEach((user) => {
        if (!onlineUsers[user?.userId]) return;
        io.to(user?.userId).emit("message:delivery-status", user);
      });
    } catch (error) {
      socket.to(userId).emit("error", error.message);
    }
  });
  socket.on("seen:status", async (data) => {
    try {
      let updatedResult = await messageModel.updateOne(
        { tempId: data.msgId },
        { $set: { seen: "SEEN" } }
      );
      if (!onlineUsers[data?.to?._id]) return;
      io.to(data?.to?._id).emit("seen-status:success", data);
    } catch (error) {
      socket.to(userId).emit("error", error.message);
    }
  });
  
  /*-------> Calling System <-------*/
  socket.on("start:incoming-call",(info)=>{
     if(!onlineUsers[info?.to_id]) return 
      io.to(info?.to_id).emit("receive:incoming-call",info)
  })
  
//       DISCONNECT
  socket.on("disconnect", () => {
    console.log(`\n[-] ${username} disconnected → ${socket.id}\n`);
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
