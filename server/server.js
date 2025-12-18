// Require All The Modules Here...
"use strict";
require("dotenv").config();
require("express-async-error");
const express = require("express");
const http = require("node:http");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const config = require("./configs");
const requestIdMiddleware = require("./middlewares/request-id");
const errorHandler = require("./middlewares/error-handler");
// const routes = require("./routes");
const { connectDB, isConnected } = require("./db/mongoose");
const createSocket = require("./socket");
const app = express();

if (config.TRUST_PROXY) app.set("trust proxy", 1);
app.use(helmet());
app.use(
    cors({
        origin: config.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "X-Request-ID"
        ],
        credentials: true
    })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: config.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.BODY_LIMIT }));
app.use(requestIdMiddleware);
app.use(errorHandler);

app.use(
    morgan((tokens, req, res) => {
        const info = {
            remoteAddr: tokens["remote-addr"](req, res),
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            responseTimeMs: Number(tokens["response-time"](req, res)),
            contentLength: tokens.res(req, res, "content-length"),
            requestId: req.id
        };
        console.log("access : ", info);
        //return JSON.stringify(info);
    })
);

const limiter = rateLimit({
    windowMs:
        (parseInt(config.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
    max: parseInt(config.RATE_LIMIT_MAX, 10) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// lightweight health/readiness
app.get("/health", (req, res) =>
    res.json({
        status: "OK",
        message: "API is active",
        uptime: process.uptime(),
        timestamp: Date.now()
    })
);
app.get("/ready", (req, res) => {
    const dbReady = isConnected();
    res.json({ ready: dbReady, timestamp: Date.now() });
});

/*-----------------------------------------------------------------------------------------------*/
/*---------> API ENDPOINTS <--------*/
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chats", require("./routes/chats.routes"));

/*-----------------------------------------------------------------------------------------------*/

// 404
app.use((req, res) =>
    res.status(404).json({ error: "Not Found", requestId: req.id })
);

/*-----------------------------------------------------------------------------------------------*/
// create server and attach socket.io
const server = http.createServer(app);
let connections = new Set();
const io = createSocket(server, config);

server.on("connection", socket => {
    connections.add(socket);
    socket.on("close", () => connections.delete(socket));
});

// Start sequence: connect DB -> start server
const start = async () => {
    try {
        console.clear();
        await connectDB();
        await new Promise((resolve, reject) => {
            server.listen(config.PORT, () => {
                console.log(`\n[+] Server Listening On - ${config.PORT}\n`);
                resolve();
            });
            server.on("error", reject);
        });
    } catch (error) {
        console.log("Failed to start", error.message);
        process.exit(1);
    }
};

// start
start().catch(error => {
    console.error("\n[!] Startup error", error.message);
    process.exit(1);
});

// for testing
module.exports = { app, server, io };
