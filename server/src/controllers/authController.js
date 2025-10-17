const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const signupUser = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const newUser = await User.create({
      first_name,
      last_name,
      phone,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in signupUser:", error); // Detailed logging
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error); // Detailed logging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signupUser, loginUser };