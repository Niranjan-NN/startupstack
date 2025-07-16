"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Building2, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface BookmarkedStack {
  _id: string
  stackId: string
  stack: {
    _id: string
    name: string
    industry: string
    scale: string
    location: string
    description: string
    techStack: {
      frontend: string[]
      backend: string[]
      database: string[]
      infrastructure: string[]
    }
    employees: string
  }
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedStack[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchBookmarks()
  }, [user, router])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setBookmarks(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
      setLoading(false)
    }
  }

  const removeBookmark = async (stackId: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ stackId }),
      })

      if (response.ok) {
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.stackId !== stackId))
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StartupStack</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Browse Stacks
                </Button>
              </Link>
              <Link href="/contribute">
                <Button variant="ghost" size="sm">
                  Contribute
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Bookmarks</h2>
          <p className="text-gray-600">
            {bookmarks.length} saved startup{bookmarks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-4">Start exploring and bookmark your favorite startup stacks!</p>
            <Link href="/">
              <Button>Browse Stacks</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bookmark.stack.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{bookmark.stack.industry}</Badge>
                        <Badge variant="outline">{bookmark.stack.scale}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(bookmark.stackId)}
                      className="text-red-500"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bookmark.stack.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{bookmark.stack.employees} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{bookmark.stack.location}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Tech Stack Preview:</h4>
                    <div className="flex flex-wrap gap-1">
                      {bookmark.stack.techStack.frontend.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {bookmark.stack.techStack.backend.slice(0, 2).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        +more
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/stack/${bookmark.stack._id}`}>
                      <Button className="w-full" size="sm">
                        View Full Stack
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
