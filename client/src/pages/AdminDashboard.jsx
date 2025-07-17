"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"
import axios from "axios"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { toast } from "../components/ui/Toaster"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    fetchStats()
    fetchContributions()
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/admin/stats")
      setStats(response.data.stats)
    } catch (error) {
      toast.error("Failed to fetch stats")
    }
  }

  const fetchContributions = async () => {
    try {
      const response = await axios.get(`/api/admin/contributions?status=${activeTab}`)
      setContributions(response.data.contributions)
    } catch (error) {
      toast.error("Failed to fetch contributions")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (contributionId, action, adminNotes = "") => {
    try {
      await axios.post(`/api/admin/contributions/${contributionId}/review`, {
        action,
        adminNotes,
      })

      toast.success(`Contribution ${action}d successfully`)
      fetchContributions()
      fetchStats()
    } catch (error) {
      toast.error(`Failed to ${action} contribution`)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage contributions and view platform statistics
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stacks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStacks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingContributions}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Industry</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.industryStats?.[0]?._id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contributions */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab} Contributions
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {contributions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} contributions
              </h3>
              <p className="text-gray-600">
                {activeTab === "pending"
                  ? "All contributions have been reviewed"
                  : `No ${activeTab} contributions found`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {contributions.map((contribution) => (
                <div
                  key={contribution._id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contribution.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="badge-primary text-xs">
                          {contribution.industry}
                        </span>
                        <span className="badge-secondary text-xs">
                          {contribution.scale}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Submitted by{" "}
                        {contribution.contributedBy?.username || "Unknown"} on{" "}
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {contribution.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleReview(contribution._id, "approve")
                            }
                            className="flex items-center space-x-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-md text-sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              handleReview(contribution._id, "reject")
                            }
                            className="flex items-center space-x-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded-md text-sm"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`badge text-xs ${
                            contribution.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contribution.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location:</p>
                      <p className="font-medium">{contribution.location}</p>
                    </div>
                    {contribution.website && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Website:</p>
                        <a
                          href={contribution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {contribution.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                    <p className="text-gray-900">{contribution.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(contribution.techStack).flatMap(
                        ([category, techs]) =>
                          techs.slice(0, 3).map((tech, i) => (
                            <span
                              key={`${category}-${i}`}
                              className="badge-outline text-xs"
                            >
                              {tech}
                            </span>
                          )),
                      )}
                      <span className="badge-outline text-xs">+more</span>
                    </div>
                  </div>

                  {contribution.adminNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-1">Admin Notes:</p>
                      <p className="text-sm text-gray-900">
                        {contribution.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
