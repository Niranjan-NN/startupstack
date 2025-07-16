const { validationResult } = require("express-validator");
const StartupStack = require("../models/StartupStack");
const Contribution = require("../models/Contribution");
const User = require("../models/User");

const getStacks = async (req, res) => {
  try {
    const { industry, scale, search, page = 1, limit = 12 } = req.query;

    const filter = { status: "approved" };

    if (industry && industry !== "all") {
      filter.industry = industry;
    }

    if (scale && scale !== "all") {
      filter.scale = scale;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const stacks = await StartupStack.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("contributedBy", "username");

    const total = await StartupStack.countDocuments(filter);

    res.json({
      stacks,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("❌ Get stacks error:", error);
    res.status(500).json({ message: "Server error while fetching stacks" });
  }
};

const getStackById = async (req, res) => {
  try {
    const stack = await StartupStack.findById(req.params.id).populate("contributedBy", "username");

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    res.json({ stack });
  } catch (error) {
    console.error("❌ Get stack by ID error:", error);
    res.status(500).json({ message: "Server error while fetching stack" });
  }
};

const bookmarkStack = async (req, res) => {
  try {
    const { stackId } = req.body;
    const userId = req.user._id;

    const stack = await StartupStack.findById(stackId);
    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(stackId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => !id.equals(stackId));
      await user.save();
      res.json({ message: "Bookmark removed", bookmarked: false });
    } else {
      user.bookmarks.push(stackId);
      await user.save();
      res.json({ message: "Stack bookmarked", bookmarked: true });
    }
  } catch (error) {
    console.error("❌ Bookmark error:", error);
    res.status(500).json({ message: "Server error while bookmarking" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      populate: {
        path: "contributedBy",
        select: "username",
      },
    });

    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("❌ Get bookmarks error:", error);
    res.status(500).json({ message: "Server error while fetching bookmarks" });
  }
};

const contributeStack = async (req, res) => {
  // Step 1: Log the raw incoming data and user
  console.log("📨 Contribution Request:", req.body);
  console.log("🔐 Authenticated User:", req.user);

  // Step 2: Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("❌ Validation errors:", errors.array());
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    // Clean tech stack arrays (remove empty strings)
    const cleanedTechStack = {};
    Object.keys(req.body.techStack || {}).forEach((key) => {
      cleanedTechStack[key] = req.body.techStack[key].filter((item) => item.trim() !== "");
    });

    const contributionData = {
      name: req.body.name,
      industry: req.body.industry,
      scale: req.body.scale,
      location: req.body.location,
      description: req.body.description,
      techStack: cleanedTechStack,
      founded: req.body.founded,
      employees: req.body.employees,
      funding: req.body.funding,
      website: req.body.website,
      contributedBy: req.user._id,
    };

    const contribution = new Contribution(contributionData);
    await contribution.save();

    res.status(201).json({
      message: "Contribution submitted successfully",
      contribution: {
        id: contribution._id,
        name: contribution.name,
        status: contribution.status,
        createdAt: contribution.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Contribute stack error:", error);
    res.status(500).json({ message: "Server error while submitting contribution" });
  }
};

module.exports = {
  getStacks,
  getStackById,
  bookmarkStack,
  getBookmarks,
  contributeStack,
};
