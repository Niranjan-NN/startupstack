const express = require("express")
const { getContributions, reviewContribution, getStats } = require("../controllers/adminController")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Routes (all require admin authentication)
router.get("/contributions", adminAuth, getContributions)
router.post("/contributions/:id/review", adminAuth, reviewContribution)
router.get("/stats", adminAuth, getStats)

module.exports = router
