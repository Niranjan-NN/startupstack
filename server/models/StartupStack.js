const mongoose = require("mongoose")

const startupStackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  industry: {
    type: String,
    required: true,
    enum: ["Fintech", "EdTech", "HealthTech", "E-commerce", "SaaS", "AI/ML", "Gaming", "Social Media", "Other"],
  },
  scale: {
    type: String,
    required: true,
    enum: ["Seed", "Series A", "Series B", "Series C+", "Unicorn", "Public"],
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  techStack: {
    frontend: [{ type: String, trim: true }],
    backend: [{ type: String, trim: true }],
    database: [{ type: String, trim: true }],
    infrastructure: [{ type: String, trim: true }],
    mobile: [{ type: String, trim: true }],
    other: [{ type: String, trim: true }],
  },
  founded: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
  },
  employees: {
    type: String,
    trim: true,
  },
  funding: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
    trim: true,
  },
  contributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "approved",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
startupStackSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("StartupStack", startupStackSchema)
