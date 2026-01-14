import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Notification from "../models/notificationModel.js";
dotenv.config();

const normalizePublicRole = (role) => {
  if (!role) return "tourist";
  const value = String(role).toLowerCase().trim();
  if (value === "guide") return "local";
  if (value === "local" || value === "tourist") return value;
  // Prevent privilege escalation (e.g. role=admin)
  return "tourist";
};

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Register
export const registerUser = async (req, res) => {
  try {
    const role = normalizePublicRole(req.body?.role);
    const user = await User.create({ ...req.body, role });

    // Admin notification: new user registration
    try {
      await Notification.createForRole("admin", {
        type: "user_registered",
        title: "New user registration",
        message: `${user?.first_name || "A user"} registered as ${
          user?.role || "tourist"
        }.`,
        link: "/admin?tab=users",
        metadata: { user_id: user?.user_id, role: user?.role },
      });
    } catch {
      // ignore
    }

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // MySQL stores booleans as TINYINT (0/1). Treat 0/"0" as blocked.
    if (!Number(user.is_verified)) {
      return res
        .status(403)
        .json({ message: "Account blocked", error: "Account blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    // Never send password hash to the client
    const safeUser = await User.findById(user.user_id);
    res.json({ token, user: safeUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Current user profile (from JWT)
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers(req.query.role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by ID
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params?.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pickProfileUpdates = (body = {}) => {
  // Only allow profile fields here. Role, is_verified, badge_status, etc. must
  // be changed via admin endpoints.
  const first_name = body.first_name ?? body.firstName;
  const last_name = body.last_name ?? body.lastName;
  const phone = body.phone;
  const profile_picture =
    body.profile_picture ?? body.profilePicture ?? body.avatar;
  const email = body.email;
  return { first_name, last_name, phone, profile_picture, email };
};

// Update current user profile (from JWT)
export const updateMe = async (req, res) => {
  try {
    const userId = Number(req.user?.user_id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await User.findById(userId);
    if (!existing) return res.status(404).json({ message: "User not found" });

    const updates = pickProfileUpdates(req.body);

    // Email: optional, but if provided enforce uniqueness.
    const nextEmail =
      updates.email != null ? String(updates.email).trim() : undefined;
    if (nextEmail && nextEmail !== existing.email) {
      const other = await User.findByEmail(nextEmail);
      if (other && Number(other.user_id) !== userId) {
        return res.status(409).json({
          message: "Email already in use",
          error: "Email already in use",
        });
      }
      await User.updateEmail(userId, nextEmail);
    }

    const toSave = {
      first_name:
        updates.first_name != null
          ? String(updates.first_name).trim()
          : existing.first_name,
      last_name:
        updates.last_name != null
          ? String(updates.last_name).trim()
          : existing.last_name,
      phone:
        updates.phone != null ? String(updates.phone).trim() : existing.phone,
      profile_picture:
        updates.profile_picture != null
          ? String(updates.profile_picture).trim()
          : existing.profile_picture,
    };

    await User.update(userId, toSave);
    const user = await User.findById(userId);
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateUser = async (req, res) => {
  try {
    const meId = Number(req.user?.user_id);
    if (!Number.isFinite(meId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetId = Number(req.params.id);
    if (!Number.isFinite(targetId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const meRole = String(req.user?.role || "tourist").toLowerCase();
    if (meRole !== "admin" && meId !== targetId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const existing = await User.findById(targetId);
    if (!existing) return res.status(404).json({ message: "User not found" });

    const updates = pickProfileUpdates(req.body);

    const nextEmail =
      updates.email != null ? String(updates.email).trim() : undefined;
    if (nextEmail && nextEmail !== existing.email) {
      const other = await User.findByEmail(nextEmail);
      if (other && Number(other.user_id) !== targetId) {
        return res.status(409).json({
          message: "Email already in use",
          error: "Email already in use",
        });
      }
      await User.updateEmail(targetId, nextEmail);
    }

    const toSave = {
      first_name:
        updates.first_name != null
          ? String(updates.first_name).trim()
          : existing.first_name,
      last_name:
        updates.last_name != null
          ? String(updates.last_name).trim()
          : existing.last_name,
      phone:
        updates.phone != null ? String(updates.phone).trim() : existing.phone,
      profile_picture:
        updates.profile_picture != null
          ? String(updates.profile_picture).trim()
          : existing.profile_picture,
    };

    await User.update(targetId, toSave);
    const user = await User.findById(targetId);
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


