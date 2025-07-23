"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Heart, ExternalLink, Users, MapPin, Calendar, DollarSign, Building2 } from "lucide-react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "../components/ui/Toaster"

const StackDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [stack, setStack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    fetchStack()
    if (user) {
      checkBookmarkStatus()
    }
  }, [id, user])

  const fetchStack = async () => {
    try {
      const response = await axios.get(`https://startupstack-api.onrender.com/api/stack/${id}`)
      setStack(response.data.stack)
    } catch (error) {
      toast.error("Failed to fetch stack details")
      console.error("Fetch stack error:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkBookmarkStatus = async () => {
    try {
      const response = await axios.get("https://startupstack-api.onrender.com/api/stack/user/bookmarks")
      const bookmarkIds = response.data.bookmarks.map((b) => b._id)
      setIsBookmarked(bookmarkIds.includes(id))
    } catch (error) {
      // User might not be logged in, ignore error
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark stacks")
      return
    }

    setBookmarkLoading(true)
    try {
      const response = await axios.post("https://startupstack-api.onrender.com/api/stack/bookmark", {
        stackId: id,
      })

      setIsBookmarked(response.data.bookmarked)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark")
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!stack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stack not found</h2>
          <p className="text-gray-600 mb-4">The stack you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const techCategories = [
    { key: "frontend", label: "Frontend", color: "bg-blue-100 text-blue-800" },
    { key: "backend", label: "Backend", color: "bg-green-100 text-green-800" },
    { key: "database", label: "Database", color: "bg-purple-100 text-purple-800" },
    { key: "infrastructure", label: "Infrastructure", color: "bg-orange-100 text-orange-800" },
    { key: "mobile", label: "Mobile", color: "bg-pink-100 text-pink-800" },
    { key: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stacks
        </Link>

        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            isBookmarked ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          } ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
      </div>

      {/* Company Info */}
      <div className="card p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{stack.name}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <span className="badge-primary text-sm">{stack.industry}</span>
              <span className="badge-secondary text-sm">{stack.scale}</span>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">{stack.description}</p>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stack.founded && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Founded</p>
                <p className="font-medium">{stack.founded}</p>
              </div>
            </div>
          )}

          {stack.employees && (
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-medium">{stack.employees}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{stack.location}</p>
            </div>
          </div>

          {stack.funding && (
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Funding</p>
                <p className="font-medium">{stack.funding}</p>
              </div>
            </div>
          )}
        </div>

        {/* Website Link */}
        {stack.website && (
          <div className="pt-4 border-t border-gray-200">
            <a
              href={stack.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Tech Stack */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techCategories.map(({ key, label, color }) => {
            const techs = stack.techStack[key] || []
            if (techs.length === 0) return null

            return (
              <div key={key} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contributor Info */}
      {stack.contributedBy && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Contributed by <span className="font-medium text-gray-900">{stack.contributedBy.username}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default StackDetailPage
