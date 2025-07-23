"use client"

import { Link } from "react-router-dom"
import { Heart, Users, MapPin, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import { toast } from "../ui/Toaster"

const StackCard = ({ stack, isBookmarked: initialBookmarked = false, onBookmarkChange }) => {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  const handleBookmark = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please login to bookmark stacks")
      return
    }

    setBookmarkLoading(true)
    try {
      const response = await axios.post("https://startupstack-api.onrender.com/api/stack/bookmark", {
        stackId: stack._id,
      })

      setIsBookmarked(response.data.bookmarked)
      toast.success(response.data.message)

      if (onBookmarkChange) {
        onBookmarkChange(stack._id, response.data.bookmarked)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark")
    } finally {
      setBookmarkLoading(false)
    }
  }

  const getTechStackPreview = () => {
    const allTechs = [
      ...stack.techStack.frontend.slice(0, 2),
      ...stack.techStack.backend.slice(0, 2),
      ...stack.techStack.database.slice(0, 1),
    ]
    return allTechs.slice(0, 4)
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{stack.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="badge-primary">{stack.industry}</span>
            <span className="badge-secondary">{stack.scale}</span>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
          } ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stack.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{stack.location}</span>
        </div>
        {stack.employees && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{stack.employees} employees</span>
          </div>
        )}
      </div>

      {/* Tech Stack Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack:</h4>
        <div className="flex flex-wrap gap-1">
          {getTechStackPreview().map((tech, index) => (
            <span key={index} className="badge-outline text-xs">
              {tech}
            </span>
          ))}
          <span className="badge-outline text-xs">+more</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link to={`/stack/${stack._id}`} className="btn-primary text-sm">
          View Details
        </Link>

        {stack.website && (
          <a
            href={stack.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

export default StackCard
