import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../src/models/userModel.js";
dotenv.config();

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided", error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let dbUser;
    try {
      dbUser = await User.findById(decoded?.user_id);
    } catch (e) {
      return res.status(500).json({ message: "Server error" });
    }

    if (!dbUser) return res.status(401).json({ message: "Unauthorized" });
    // MySQL stores booleans as TINYINT (0/1). Treat 0/"0" as blocked.
    if (!Number(dbUser.is_verified)) {
      return res
        .status(403)
        .json({ message: "Account blocked", error: "Account blocked" });
    }

    // Best-effort last-seen update (never block requests if the column doesn't exist).
    try {
      await User.touchLastSeen(dbUser.user_id);
    } catch {
      // ignore
    }

    // Use DB role so role changes apply immediately.
    req.user = { user_id: dbUser.user_id, role: dbUser.role };
    next();
  } catch {
    res.status(403).json({ message: "Invalid token", error: "Invalid token" });
  }
};

export const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles
    .flat()
    .map((r) => String(r).toLowerCase().trim())
    .filter(Boolean);

  return (req, res, next) => {
    const role = String(req.user?.role || "")
      .toLowerCase()
      .trim();
    if (!role) return res.status(401).json({ message: "Unauthorized" });
    if (!normalizedAllowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden", error: "Forbidden" });
    }
    next();
  };
};

export const requireAdmin = requireRole("admin");
