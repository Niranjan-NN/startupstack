const Contribution = require("../models/Contribution")
const StartupStack = require("../models/StartupStack")
const User = require("../models/User")

const getContributions = async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 10 } = req.query

    const filter = status !== "all" ? { status } : {}
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const contributions = await Contribution.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("contributedBy", "username email")
      .populate("reviewedBy", "username")

    const total = await Contribution.countDocuments(filter)

    res.json({
      contributions,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    })
  } catch (error) {
    console.error("Get contributions error:", error)
    res.status(500).json({ message: "Server error while fetching contributions" })
  }
}

const reviewContribution = async (req, res) => {
  try {
    const { id } = req.params
    const { action, adminNotes } = req.body // action: 'approve' or 'reject'

    const contribution = await Contribution.findById(id)
    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" })
    }

    if (action === "approve") {
      // Create new startup stack from contribution
      const stackData = {
        name: contribution.name,
        industry: contribution.industry,
        scale: contribution.scale,
        location: contribution.location,
        description: contribution.description,
        techStack: contribution.techStack,
        founded: contribution.founded,
        employees: contribution.employees,
        funding: contribution.funding,
        website: contribution.website,
        logo: contribution.logo,
        contributedBy: contribution.contributedBy,
        status: "approved",
      }

      const newStack = new StartupStack(stackData)
      await newStack.save()

      // Update contribution status
      contribution.status = "approved"
      contribution.reviewedBy = req.user._id
      contribution.reviewedAt = new Date()
      contribution.adminNotes = adminNotes
      await contribution.save()

      res.json({
        message: "Contribution approved and stack created",
        stackId: newStack._id,
      })
    } else if (action === "reject") {
      contribution.status = "rejected"
      contribution.reviewedBy = req.user._id
      contribution.reviewedAt = new Date()
      contribution.adminNotes = adminNotes
      await contribution.save()

      res.json({ message: "Contribution rejected" })
    } else {
      res.status(400).json({ message: "Invalid action" })
    }
  } catch (error) {
    console.error("Review contribution error:", error)
    res.status(500).json({ message: "Server error while reviewing contribution" })
  }
}

const getStats = async (req, res) => {
  try {
    const totalStacks = await StartupStack.countDocuments({ status: "approved" })
    const pendingContributions = await Contribution.countDocuments({ status: "pending" })
    const totalUsers = await User.countDocuments()

    // Get industry distribution
    const industryStats = await StartupStack.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$industry", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get scale distribution
    const scaleStats = await StartupStack.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$scale", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      stats: {
        totalStacks,
        pendingContributions,
        totalUsers,
        industryStats,
        scaleStats,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error while fetching stats" })
  }
}

module.exports = {
  getContributions,
  reviewContribution,
  getStats,
}
