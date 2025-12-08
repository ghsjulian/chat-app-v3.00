"use strict";
/**ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
 * - Create and configure a Socket.IO server
 * - Example namespace and basic events (connect, join, message, disconnect)
 */

const { Server } = require("socket.io");

module.exports = function createSocket(server, config, logger) {
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: config.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 30000,
    maxHttpBufferSize: 1e6, // limit message size to 1MB
  });
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query?.token;
      socket.user = token ? { id: token } : null;
      return next();
    } catch (err) {
      logger.warn("Socket auth failed", { err });
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    logger.info("Socket connected", { id: socket.id, user: socket.user });

    socket.on("joinRoom", (room, cb) => {
      try {
        if (!room) return cb?.({ ok: false, error: "Room required" });
        socket.join(room);
        logger.info("Socket joined room", { socketId: socket.id, room });
        cb?.({ ok: true });
      } catch (err) {
        logger.warn("joinRoom error", { err });
        cb?.({ ok: false, error: err.message });
      }
    });
    socket.on("roomMessage", (payload, cb) => {
      try {
        const { room, message } = payload || {};
        if (!room || !message)
          return cb?.({ ok: false, error: "room & message required" });
        const out = { from: socket.id, message, ts: Date.now() };
        socket.to(room).emit("roomMessage", out);
        cb?.({ ok: true });
      } catch (err) {
        logger.warn("roomMessage error", { err });
        cb?.({ ok: false, error: err.message });
      }
    });
    // ping/pong or heartbeat can be handled by socket.io itself
    socket.on("disconnect", (reason) => {
      logger.info("Socket disconnected", { id: socket.id, reason });
    });
  });
  return io;
};
