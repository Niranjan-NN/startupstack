const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Regular User Auth Middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or malformed" })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found for provided token" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

// Admin Auth Middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
      }
      next()
    })
  } catch (error) {
    console.error("Admin auth error:", error.message)
    return res.status(401).json({ message: "Admin authorization failed" })
  }
}

module.exports = { auth, adminAuth }
