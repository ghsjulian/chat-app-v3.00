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
    console.log("\n[*] Connecting to MongoDB", {
      attempt,
      uri: uri.replace(/\/\/.*:.*@/, "//[REDACTED]@"),
    });
    await mongoose.connect(uri, DEFAULT_OPTIONS);
    connectionState = 1;
    console.log("\n[+] MongoDB connected successfully")
    return mongoose.connection;
  } catch (error) {
    console.log("\n[!] MongoDB connection failed", { attempt, error: error.message });
    // simple retry with backoff up to X attempts
    const maxAttempts = parseInt(
      process.env.MONGO_CONNECT_MAX_ATTEMPTS || "5",
      10
    );
    if (attempt < maxAttempts) {
      const backoff = Math.min(1000 * Math.pow(2, attempt), 30000);
      console.log("\n[*] Retrying MongoDB connection", { nextAttemptMs: backoff });
      await new Promise((r) => setTimeout(r, backoff));
      return connectDB(attempt + 1);
    }
    connectionState = 0;
    throw error;
  }
};

const disconnect = async () => {
  if (connectionState !== 1) return;
  try {
    await mongoose.disconnect();
    connectionState = 0;
  } catch (error) {
    console.log("\n[!] Error during mongoose.disconnect", { error });
  }
};

const isConnected = () => {
  return connectionState === 1 && mongoose.connection?.readyState === 1;
};

module.exports = { connectDB, disconnect, isConnected, mongoose };
