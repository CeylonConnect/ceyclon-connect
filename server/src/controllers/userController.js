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

// Update
export const updateUser = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

