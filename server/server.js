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
const { v4: uuidv4 } = require("uuid");
const winston = require("winston");
const promClient = require("prom-client");
const cookieParser = require("cookie-parser");

const config = require("./configs");
const logger = require("./logger/logger");
const requestIdMiddleware = require("./middlewares/request-id");
const errorHandler = require("./middlewares/error-handler");
// const routes = require("./routes");
const { connectDB, isConnected } = require("./db/mongoose");
const createSocket = require("./socket");

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
      "X-Request-ID",
    ],
    credentials: true,
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
      requestId: req.id,
    };
    logger.info("access", info);
    return JSON.stringify(info);
  })
);

const limiter = rateLimit({
  windowMs: (parseInt(config.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
  max: parseInt(config.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// lightweight health/readiness
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() })
);
app.get("/ready", (req, res) => {
  const dbReady = isConnected();
  res.json({ ready: dbReady, timestamp: Date.now() });
});
// 404
app.use((req, res) =>
  res.status(404).json({ error: "Not Found", requestId: req.id })
);

/*-----------------------------------------------------------------------------------------------*/
// create server and attach socket.io
const app = express();
const server = http.createServer(app);
let connections = new Set();
const io = createSocket(server, config, logger);

server.on("connection", (socket) => {
  connections.add(socket);
  socket.on("close", () => connections.delete(socket));
});

// Start sequence: connect DB -> start server
const start = async () => {
  try {
    await connectDB();
    await new Promise((resolve, reject) => {
      server.listen(config.PORT, () => {
        logger.info("Server listening", {
          port: config.PORT,
          env: config.NODE_ENV,
        });
        resolve();
      });
      server.on("error", reject);
    });
  } catch (err) {
    logger.error("Failed to start", { err });
    process.exit(1);
  }
};

async function shutdown(signal) {
  logger.info("Shutdown initiated", { signal });
  server.close((err) => {
    if (err) {
      logger.error("Error closing server", { err });
    }
  });
  try {
    if (io) {
      logger.info("Closing socket.io connections");
      io.close(true); // force close all sockets
    }
  } catch (e) {
    logger.warn("Error closing socket.io", { e });
  }
  const { disconnect } = require("./db/mongoose");
  try {
    await disconnect();
    logger.info("MongoDB disconnected cleanly");
  } catch (e) {
    logger.warn("Error disconnecting MongoDB", { e });
  }

  // allow some time for current requests; then force-close TCP sockets
  setTimeout(() => {
    logger.warn("Forcing shutdown; destroying open connections", {
      openConnections: connections.size,
    });
    for (const sock of connections) {
      try {
        sock.destroy();
      } catch (e) {
        logger.warn("Socket destroy failed", { e });
      }
    }
    process.exit(0);
  }, parseInt(config.FORCE_SHUTDOWN_TIMEOUT_MS, 10) || 10000).unref();
}

// signal handlers
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  logger.error("uncaughtException", { err });
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.error("unhandledRejection", { reason });
});

// start
start().catch((err) => {
  logger.error("Startup error", { err });
  process.exit(1);
});

// for testing
module.exports = { app, server, io };
