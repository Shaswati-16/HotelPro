const jwt = require("jsonwebtoken");

// Checks for a valid "Authorization: Bearer <token>" header
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ msg: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid or has expired" });
  }
};

// Must be used after requireAuth
const requireAdmin = (req, res, next) => {
  if (req.user?.userType !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
