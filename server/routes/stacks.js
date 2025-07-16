const express = require("express")
const { body } = require("express-validator")
const {
  getStacks,
  getStackById,
  bookmarkStack,
  getBookmarks,
  contributeStack,
} = require("../controllers/stackController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Validation for contribution
const contributionValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Startup name is required and must be less than 100 characters"),

  body("industry")
    .isIn(["Fintech", "EdTech", "HealthTech", "E-commerce", "SaaS", "AI/ML", "Gaming", "Social Media", "Other"])
    .withMessage("Please select a valid industry"),

  body("scale")
    .isIn(["Seed", "Series A", "Series B", "Series C+", "Unicorn", "Public"])
    .withMessage("Please select a valid scale"),

  body("location")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Location is required and must be less than 100 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  // Optional: Add these if you're validating optional fields
  body("founded")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Founded year must be valid"),

  body("employees")
    .optional()
    .isString()
    .withMessage("Employees must be a string"),

  body("funding")
    .optional()
    .isString()
    .withMessage("Funding must be a string"),

  body("website")
    .optional()
    .isURL()
    .withMessage("Website must be a valid URL"),
]

// Routes
router.get("/list", getStacks)
router.get("/:id", getStackById)
router.post("/bookmark", auth, bookmarkStack)
router.get("/user/bookmarks", auth, getBookmarks)
router.post("/contribute", auth, contributionValidation, contributeStack)

module.exports = router
