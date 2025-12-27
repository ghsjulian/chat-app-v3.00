// Require All The Modules Here...
"use strict";
require("dotenv").config();
require("express-async-error");

const path = require("node:path");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./configs");
const { connectDB, isConnected } = require("./db/mongoose");
const { express, app, io, server } = require("./socket");

if (config.TRUST_PROXY) app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
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

app.use(cookieParser());

app.get("/health", (req, res) =>
  res.json({
    status: "OK",
    message: "API is active",
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
);
app.get("/ready", (req, res) => {
  const dbReady = isConnected();
  res.json({ ready: dbReady, timestamp: Date.now() });
});

/*-----------------------------------------------------------------------------------------------*/
/*---------> API ENDPOINTS <--------*/
const isAuth = require("./middlewares/is-auth");
app.use("/uploads", isAuth, express.static(path.join("uploads")));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chats", require("./routes/chats-v2.routes"));

/*-----------------------------------------------------------------------------------------------*/
// 404
app.use((req, res) =>
  res.status(404).json({ error: "Not Found", requestId: req.id })
);

/*-----------------------------------------------------------------------------------------------*/
// create server and attach socket.io

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
start().catch((error) => {
  console.error("\n[!] Startup error", error.message);
  process.exit(1);
});

// for testing
module.exports = { app, server };
