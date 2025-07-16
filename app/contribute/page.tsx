"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function ContributePage() {
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
    frontend: [""],
    backend: [""],
    database: [""],
    infrastructure: [""],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTechStackChange = (category: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const addTechStackItem = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: [...prev[category as keyof typeof prev], ""],
    }))
  }

  const removeTechStackItem = (category: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].filter((_: string, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          techStack: {
            frontend: formData.frontend.filter((item) => item.trim()),
            backend: formData.backend.filter((item) => item.trim()),
            database: formData.database.filter((item) => item.trim()),
            infrastructure: formData.infrastructure.filter((item) => item.trim()),
          },
        }),
      })

      if (response.ok) {
        setSuccess(true)
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
          frontend: [""],
          backend: [""],
          database: [""],
          infrastructure: [""],
        })
      } else {
        const data = await response.json()
        setError(data.message || "Failed to submit contribution")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
              <Link href="/bookmarks">
                <Button variant="ghost" size="sm">
                  Bookmarks
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Contribute a Tech Stack</h2>
          <p className="text-gray-600">
            Help the community by sharing information about a startup's tech stack. All contributions are reviewed
            before being published.
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            Thank you for your contribution! It has been submitted for review and will be published once approved.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Startup Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Startup Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    placeholder="e.g., Stripe"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  placeholder="Brief description of what the startup does..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scale">Scale *</Label>
                  <Select value={formData.scale} onValueChange={(value) => handleInputChange("scale", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                    <SelectContent>
                      {scales.map((scale) => (
                        <SelectItem key={scale} value={scale}>
                          {scale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded}
                    onChange={(e) => handleInputChange("founded", e.target.value)}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="employees">Employees</Label>
                  <Input
                    id="employees"
                    value={formData.employees}
                    onChange={(e) => handleInputChange("employees", e.target.value)}
                    placeholder="e.g., 100-500"
                  />
                </div>
                <div>
                  <Label htmlFor="funding">Funding</Label>
                  <Input
                    id="funding"
                    value={formData.funding}
                    onChange={(e) => handleInputChange("funding", e.target.value)}
                    placeholder="e.g., $50M Series B"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Tech Stack</h3>

                {(["frontend", "backend", "database", "infrastructure"] as const).map((category) => (
                  <div key={category}>
                    <Label className="capitalize">{category} Technologies</Label>
                    <div className="space-y-2 mt-2">
                      {formData[category].map((item: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => handleTechStackChange(category, index, e.target.value)}
                            placeholder={`Enter ${category} technology`}
                          />
                          {formData[category].length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTechStackItem(category, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addTechStackItem(category)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add {category} technology
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Contribution"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
