"use client"

import { Search, Filter } from "lucide-react"

const FilterPanel = ({ searchTerm, setSearchTerm, industry, setIndustry, scale, setScale, onClearFilters }) => {
  const industries = [
    "Fintech",
    "EdTech",
    "HealthTech",
    "E-commerce",
    "SaaS",
    "AI/ML",
    "Gaming",
    "Social Media",
    "Other",
  ]

  const scales = ["Seed", "Series A", "Series B", "Series C+", "Unicorn", "Public"]

  const hasActiveFilters = searchTerm || industry !== "all" || scale !== "all"

  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Stacks</h2>
        </div>

        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-blue-600 hover:text-blue-800">
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search startups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Industry Filter */}
        <div>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="input">
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Scale Filter */}
        <div>
          <select value={scale} onChange={(e) => setScale(e.target.value)} className="input">
            <option value="all">All Scales</option>
            {scales.map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
