const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Updated: Include role in token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("❌ JWT_SECRET is not set in the environment variables.");
    throw new Error("Internal server error: JWT_SECRET is missing");
  }

  return jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: "7d" });
};

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    const user = new User({ username, email, password });
    //const user = new User({ username, email, password, role: "admin" });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message || error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("bookmarks");

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error.message || error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getProfile };
