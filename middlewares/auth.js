// middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware factory function that accepts roles
module.exports = function (roles = []) {
  return function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Role check (if roles are defined)
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          error: "Access denied, You are not authorized for this action",
        });
      }

      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
  };
};
