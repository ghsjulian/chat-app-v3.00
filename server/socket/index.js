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
        socket.user = token ? token : null;
        socket.userId = token._id;
        socket.username = token.name;

        return next();
    } catch (error) {
        console.log("\n[!] Socket authentication failed", { error });
        return next(new Error("Authentication error"));
    }
});

IO.on("connection", socket => {
    console.log(`\n[+] ${socket?.username} Connected\n`);
    console.log(`[+] Connected ID - ${socket?.userId}\n`);
    
    // Join Personal Room 
    socket.join(socket.userId);
    // Notify online status
    socket.broadcast.emit("user:online", socket.userId);
    
    
    socket.on("disconnect", reason => {
        socket.broadcast.emit("user:offline", socket.userId);
        console.log(`\n[!] ${socket?.username} Disconnected\n`);
    console.log(`[!] Disconnected ID - ${socket?.userId}\n`);
    });
});

module.exports = { express, app, IO, server };

/* 
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../configs");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    path: "/socket.io",
    cors: {
        origin: config.CORS_ORIGIN || "*",
        credentials: true
    },
    pingTimeout: 30000,
    pingInterval: 10000,
    maxHttpBufferSize: 1e6
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        const decoded = jwt.verify(token, config.JWT_SECRET);
        socket.userId = decoded._id;
        socket.username = decoded.name;

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", socket => {
    console.log(`[+] ${socket.username} connected`);

    // Join personal room (WhatsApp style)
    socket.join(socket.userId);

    // Notify online status
    socket.broadcast.emit("user:online", socket.userId);

    socket.on("message:send", payload => {
        const { to, message, tempId } = payload;

        const msg = {
            from: socket.userId,
            to,
            message,
            tempId,
            createdAt: new Date()
        };

        // send to receiver
        io.to(to).emit("message:receive", msg);

        // delivery acknowledgment
        socket.emit("message:delivered", {
            tempId,
            deliveredAt: new Date()
        });
    });

    socket.on("typing:start", to => {
        socket.to(to).emit("typing:start", socket.userId);
    });

    socket.on("typing:stop", to => {
        socket.to(to).emit("typing:stop", socket.userId);
    });

    socket.on("message:read", ({ from }) => {
        io.to(from).emit("message:read", {
            by: socket.userId,
            at: new Date()
        });
    });

    socket.on("disconnect", () => {
        console.log(`[-] ${socket.username} disconnected`);
        socket.broadcast.emit("user:offline", socket.userId);
    });
});

module.exports = { app, server, io };
*/
