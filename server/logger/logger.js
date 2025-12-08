const winston = require("winston");
const isProduction = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console({ stderrLevels: ["error"] })],
  exitOnError: false,
});

module.exports = logger;
