"use client"

import { useState, useEffect } from "react"
import { Building2 } from "lucide-react"
import axios from "axios"
import StackCard from "../components/stacks/StackCard"
import FilterPanel from "../components/stacks/FilterPanel"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "../components/ui/Toaster"

const HomePage = () => {
  const [stacks, setStacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [industry, setIndustry] = useState("all")
  const [scale, setScale] = useState("all")
  const [pagination, setPagination] = useState({})
  const [bookmarkedStacks, setBookmarkedStacks] = useState(new Set())

  useEffect(() => {
    fetchStacks()
  }, [searchTerm, industry, scale])

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchStacks = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (searchTerm) params.append("search", searchTerm)
      if (industry !== "all") params.append("industry", industry)
      if (scale !== "all") params.append("scale", scale)

      const response = await axios.get(`/api/stack/list?${params}`)
      setStacks(response.data.stacks)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error("Failed to fetch stacks")
      console.error("Fetch stacks error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("/api/stack/user/bookmarks")
      const bookmarkIds = new Set(response.data.bookmarks.map((b) => b._id))
      setBookmarkedStacks(bookmarkIds)
    } catch (error) {
      // User might not be logged in, ignore error
    }
  }

  const handleBookmarkChange = (stackId, isBookmarked) => {
    setBookmarkedStacks((prev) => {
      const newSet = new Set(prev)
      if (isBookmarked) {
        newSet.add(stackId)
      } else {
        newSet.delete(stackId)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setIndustry("all")
    setScale("all")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Explore Startup Tech Stacks</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the technologies powering successful startups. Filter by industry, scale, and location to find
          inspiration for your next project.
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        industry={industry}
        setIndustry={setIndustry}
        scale={scale}
        setScale={setScale}
        onClearFilters={clearFilters}
      />

      {/* Results Count */}
      {!loading && (
        <div className="mb-6">
          <p className="text-gray-600">
            {pagination.total ? (
              <>
                Showing {stacks.length} of {pagination.total} startups
              </>
            ) : (
              "No startups found"
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Stacks Grid */}
      {!loading && stacks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stacks.map((stack) => (
            <StackCard
              key={stack._id}
              stack={stack}
              isBookmarked={bookmarkedStacks.has(stack._id)}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && stacks.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stacks found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchStacks(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === pagination.current
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
