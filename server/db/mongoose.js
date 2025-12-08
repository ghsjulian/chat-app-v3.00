"use strict";
/**
 * - Mongoose connection logic with basic retry/backoff
 * - Exports connectDB, disconnect, isConnected
 */
const mongoose = require("mongoose");
const logger = require("../logger/logger");
const config = require("../configs/index");

let connectionState = 0; // 0 = disconnected, 1 = connected, 2 = connecting

const DEFAULT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // fail fast
  family: 4,
};

const connectDB = async (attempt = 1) => {
  if (connectionState === 1) return mongoose.connection;
  connectionState = 2;
  const uri = config.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI not configured");
  }
  try {
    logger.info("Connecting to MongoDB", {
      attempt,
      uri: uri.replace(/\/\/.*:.*@/, "//[REDACTED]@"),
    });
    await mongoose.connect(uri, DEFAULT_OPTIONS);
    connectionState = 1;
    logger.info("MongoDB connected", {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    });
    return mongoose.connection;
  } catch (err) {
    logger.warn("MongoDB connection failed", { attempt, err: err.message });
    // simple retry with backoff up to X attempts
    const maxAttempts = parseInt(
      process.env.MONGO_CONNECT_MAX_ATTEMPTS || "5",
      10
    );
    if (attempt < maxAttempts) {
      const backoff = Math.min(1000 * Math.pow(2, attempt), 30000);
      logger.info("Retrying MongoDB connection", { nextAttemptMs: backoff });
      await new Promise((r) => setTimeout(r, backoff));
      return connectDB(attempt + 1);
    }
    connectionState = 0;
    throw err;
  }
};

const disconnect = async () => {
  if (connectionState !== 1) return;
  try {
    await mongoose.disconnect();
    connectionState = 0;
  } catch (err) {
    logger.warn("Error during mongoose.disconnect", { err });
  }
};

const isConnected = () => {
  return connectionState === 1 && mongoose.connection?.readyState === 1;
};

module.exports = { connectDB, disconnect, isConnected, mongoose };
