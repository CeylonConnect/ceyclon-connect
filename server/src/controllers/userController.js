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
    const user = await User.create(req.body);
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

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
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
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

