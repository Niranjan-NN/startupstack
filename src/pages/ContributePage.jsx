"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { toast } from "../components/ui/Toaster";

const ContributePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    scale: "",
    location: "",
    description: "",
    founded: "",
    employees: "",
    funding: "",
    website: "",
    techStack: {
      frontend: [""],
      backend: [""],
      database: [""],
      infrastructure: [""],
      mobile: [""],
      other: [""],
    },
  });

  const [loading, setLoading] = useState(false);

  const industries = [
    "Fintech", "EdTech", "HealthTech", "E-commerce", "SaaS", "AI/ML", "Gaming", "Social Media", "Other"
  ];
  const scales = ["Seed", "Series A", "Series B", "Series C+", "Unicorn", "Public"];

  const techCategories = [
    { key: "frontend", label: "Frontend Technologies" },
    { key: "backend", label: "Backend Technologies" },
    { key: "database", label: "Database Technologies" },
    { key: "infrastructure", label: "Infrastructure & DevOps" },
    { key: "mobile", label: "Mobile Technologies" },
    { key: "other", label: "Other Technologies" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTechStackChange = (category, index, value) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: prev.techStack[category].map((item, i) => (i === index ? value : item)),
      },
    }));
  };

  const addTechStackItem = (category) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: [...prev.techStack[category], ""],
      },
    }));
  };

  const removeTechStackItem = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: prev.techStack[category].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up tech stack
      const cleanedTechStack = {};
      Object.keys(formData.techStack).forEach((category) => {
        cleanedTechStack[category] = formData.techStack[category].filter((item) => item.trim() !== "");
      });

      const submitData = {
        ...formData,
        techStack: cleanedTechStack,
      };

      const token = localStorage.getItem("token");

      await axios.post("/api/stack/contribute", submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ Explicitly set content type
        },
      });

      toast.success("Contribution submitted successfully! It will be reviewed by our team.");

      // Reset form
      setFormData({
        name: "",
        industry: "",
        scale: "",
        location: "",
        description: "",
        founded: "",
        employees: "",
        funding: "",
        website: "",
        techStack: {
          frontend: [""],
          backend: [""],
          database: [""],
          infrastructure: [""],
          mobile: [""],
          other: [""],
        },
      });
    } catch (error) {
      console.error("Contribution submit error:", error);
      toast.error(error.response?.data?.message || "Failed to submit contribution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contribute a Tech Stack</h1>
        <p className="text-gray-600">
          Help the community by sharing information about a startup's tech stack. All contributions are reviewed before
          being published.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Startup Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="input"
                placeholder="e.g., Stripe"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="input"
                placeholder="https://example.com"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <select
                required
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="input"
              >
                <option value="">Select Industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scale *</label>
              <select
                required
                value={formData.scale}
                onChange={(e) => handleInputChange("scale", e.target.value)}
                className="input"
              >
                <option value="">Select Scale</option>
                {scales.map((scale) => (
                  <option key={scale} value={scale}>{scale}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="input"
                placeholder="e.g., San Francisco"
              />
            </div>

            {/* Founded */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.founded}
                onChange={(e) => handleInputChange("founded", e.target.value)}
                className="input"
              />
            </div>

            {/* Employees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
              <input
                type="text"
                value={formData.employees}
                onChange={(e) => handleInputChange("employees", e.target.value)}
                className="input"
              />
            </div>

            {/* Funding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding</label>
              <input
                type="text"
                value={formData.funding}
                onChange={(e) => handleInputChange("funding", e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="input"
              placeholder="Brief description of the startup..."
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tech Stack</h2>
          <div className="space-y-6">
            {techCategories.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
                <div className="space-y-2">
                  {formData.techStack[key].map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechStackChange(key, index, e.target.value)}
                        className="input flex-1"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                      {formData.techStack[key].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTechStackItem(key, index)}
                          className="btn-outline px-3"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTechStackItem(key)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add {label.toLowerCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => window.history.back()} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit Contribution"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContributePage;
