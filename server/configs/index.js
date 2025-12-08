const required = (name, fallback) => process.env[name] ?? fallback;

module.exports = {
  NODE_ENV: required("NODE_ENV", "development"),
  PORT: Number(required("PORT", 3000)),
  TRUST_PROXY: required("TRUST_PROXY", "false") === "true",
  CORS_ORIGIN: required("CORS_ORIGIN", "*"),
  BODY_LIMIT: required("BODY_LIMIT", "10mb"),
  RATE_LIMIT_WINDOW_MINUTES: Number(required("RATE_LIMIT_WINDOW_MINUTES", 15)),
  RATE_LIMIT_MAX: Number(required("RATE_LIMIT_MAX", 200)),
  FORCE_SHUTDOWN_TIMEOUT_MS: Number(
    required("FORCE_SHUTDOWN_TIMEOUT_MS", 10000)
  ),
  MONGO_URI: required("MONGO_URI", ""),
  SECRET_KEY: required("SECRET_KEY", ""),
  EXPIRES_IN: required("EXPIRES_IN", ""),
  DB_NAME: required("DB_NAME", ""),
  EMAIL_ADDRESS: required("EMAIL_ADDRESS", ""),
  EMAIL_PASSWORD: required("EMAIL_PASSWORD", ""),
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME", ""),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY", ""),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET", ""),
  CLOUDINARY_URL: required("CLOUDINARY_URL", ""),
};
