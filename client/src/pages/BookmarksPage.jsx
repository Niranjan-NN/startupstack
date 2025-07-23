"use client"

import { useState, useEffect } from "react"
import { Heart, Building2 } from "lucide-react"
import axios from "axios"
import StackCard from "../components/stacks/StackCard"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "../components/ui/Toaster"

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("https://startupstack-one.vercel.app/api/stack/user/bookmarks")
      setBookmarks(response.data.bookmarks)
    } catch (error) {
      toast.error("Failed to fetch bookmarks")
      console.error("Fetch bookmarks error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmarkChange = (stackId, isBookmarked) => {
    if (!isBookmarked) {
      // Remove from bookmarks list
      setBookmarks((prev) => prev.filter((stack) => stack._id !== stackId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Heart className="h-8 w-8 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
        </div>
        <p className="text-gray-600">
          {bookmarks.length} saved startup{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-4">Start exploring and bookmark your favorite startup stacks!</p>
          <a href="/" className="btn-primary">
            Browse Stacks
          </a>
        </div>
      )}

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((stack) => (
            <StackCard key={stack._id} stack={stack} isBookmarked={true} onBookmarkChange={handleBookmarkChange} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
