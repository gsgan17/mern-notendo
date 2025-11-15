// middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

/**
 * Protect middleware - checks Authorization header for `Bearer <token>`
 * On success: sets req.user = { id, email, role } (payload saved in token).
 */
export function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authorization token missing" });

    const payload = jwt.verify(token, JWT_SECRET);
    // payload should include at least id (see createToken above)
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    // differentiate expired token
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Role guard - returns middleware that checks req.user.role
 * Usage: app.get('/admin', protect, requireRole('admin'), handler)
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
