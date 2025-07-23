"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Filter, Building2, Users, MapPin, Bookmark } from "lucide-react"
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
  logo?: string
}

export default function HomePage() {
  const [stacks, setStacks] = useState<TechStack[]>([])
  const [filteredStacks, setFilteredStacks] = useState<TechStack[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [scaleFilter, setScaleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [bookmarkedStacks, setBookmarkedStacks] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    fetchStacks()
    if (user) {
      fetchBookmarks()
    }
  }, [user])

  useEffect(() => {
    filterStacks()
  }, [stacks, searchTerm, industryFilter, scaleFilter])

  const fetchStacks = async () => {
    try {
      const response = await fetch("https://startupstack-api.onrender.com/api/stacks")
      const data = await response.json()
      setStacks(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stacks:", error)
      setLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("https://startupstack-api.onrender.com/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setBookmarkedStacks(data.map((b: any) => b.stackId))
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }

  const filterStacks = () => {
    let filtered = stacks

    if (searchTerm) {
      filtered = filtered.filter(
        (stack) =>
          stack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stack.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter((stack) => stack.industry === industryFilter)
    }

    if (scaleFilter !== "all") {
      filtered = filtered.filter((stack) => stack.scale === scaleFilter)
    }

    setFilteredStacks(filtered)
  }

  const toggleBookmark = async (stackId: string) => {
    if (!user) {
      alert("Please login to bookmark stacks")
      return
    }

    try {
      const isBookmarked = bookmarkedStacks.includes(stackId)
      const method = isBookmarked ? "DELETE" : "POST"

      const response = await fetch("/api/bookmarks", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ stackId }),
      })

      if (response.ok) {
        if (isBookmarked) {
          setBookmarkedStacks((prev) => prev.filter((id) => id !== stackId))
        } else {
          setBookmarkedStacks((prev) => [...prev, stackId])
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const industries = [...new Set(stacks.map((stack) => stack.industry))]
  const scales = [...new Set(stacks.map((stack) => stack.scale))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup stacks...</p>
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
              {user ? (
                <>
                  <Link href="/bookmarks">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarks
                    </Button>
                  </Link>
                  <Link href="/contribute">
                    <Button variant="ghost" size="sm">
                      Contribute
                    </Button>
                  </Link>
                  <span className="text-sm text-gray-600">Hi, {user.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem("token")
                      window.location.reload()
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Top Startup Tech Stacks</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the technologies powering successful startups. Filter by industry, scale, and location to find
            inspiration for your next project.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={scaleFilter} onValueChange={setScaleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scales</SelectItem>
                {scales.map((scale) => (
                  <SelectItem key={scale} value={scale}>
                    {scale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredStacks.length} of {stacks.length} startups
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStacks.map((stack) => (
            <Card key={stack._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{stack.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{stack.industry}</Badge>
                      <Badge variant="outline">{stack.scale}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(stack._id)}
                    className={bookmarkedStacks.includes(stack._id) ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`h-4 w-4 ${bookmarkedStacks.includes(stack._id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stack.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{stack.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{stack.location}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Tech Stack Preview:</h4>
                  <div className="flex flex-wrap gap-1">
                    {stack.techStack.frontend.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {stack.techStack.backend.slice(0, 2).map((tech, index) => (
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
                  <Link href={`/stack/${stack._id}`}>
                    <Button className="w-full" size="sm">
                      View Full Stack
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStacks.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stacks found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}
