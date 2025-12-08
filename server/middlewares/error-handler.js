const logger = require("../logger/logger");

module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const safeMessage =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    status,
    requestId: req?.id,
    path: req?.originalUrl,
    method: req?.method,
  });
  res.status(status).json({ error: safeMessage, requestId: req?.id });
};
