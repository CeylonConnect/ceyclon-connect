import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
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
