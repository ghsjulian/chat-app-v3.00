const { v4: uuidv4 } = require("uuid");
const requestId = (req, res, next) => {
  const incoming = req.get("X-Request-ID");
  req.id = incoming || uuidv4();
  res.setHeader("X-Request-ID", req.id);
  next();
};

module.exports = requestId;
