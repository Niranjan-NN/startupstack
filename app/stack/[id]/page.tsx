"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, ExternalLink, Users, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface TechStack {
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
  founded: number
  employees: string
  funding: string
  website?: string
  logo?: string
}

export default function StackDetailPage() {
  const params = useParams()
  const [stack, setStack] = useState<TechStack | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (params.id) {
      fetchStack(params.id as string)
      if (user) {
        checkBookmarkStatus(params.id as string)
      }
    }
  }, [params.id, user])

  const fetchStack = async (id: string) => {
    try {
      const response = await fetch(`/api/stacks/${id}`)
      const data = await response.json()
      setStack(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stack:", error)
      setLoading(false)
    }
  }

  const checkBookmarkStatus = async (stackId: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const bookmarks = await response.json()
      setIsBookmarked(bookmarks.some((b: any) => b.stackId === stackId))
    } catch (error) {
      console.error("Error checking bookmark status:", error)
    }
  }

  const toggleBookmark = async () => {
    if (!user) {
      alert("Please login to bookmark stacks")
      return
    }

    try {
      const method = isBookmarked ? "DELETE" : "POST"
      const response = await fetch("/api/bookmarks", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ stackId: params.id }),
      })

      if (response.ok) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stack details...</p>
        </div>
      </div>
    )
  }

  if (!stack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stack not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stacks
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className={isBookmarked ? "text-red-500" : "text-gray-400"}
          >
            <Heart className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>

        {/* Company Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{stack.name}</CardTitle>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{stack.industry}</Badge>
                  <Badge variant="outline">{stack.scale}</Badge>
                </div>
                <p className="text-gray-600 text-lg">{stack.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Founded {stack.founded}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{stack.employees} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{stack.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{stack.funding}</span>
              </div>
            </div>
            {stack.website && (
              <div className="mt-4">
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
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.techStack.frontend.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.techStack.backend.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.techStack.database.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.techStack.infrastructure.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
