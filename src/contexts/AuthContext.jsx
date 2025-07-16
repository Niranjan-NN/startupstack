"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Set Axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Validate token and refresh user info from backend
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/auth/profile")
          setUser(response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token: newToken, user: userData } = response.data

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      })
      const { token: newToken, user: userData } = response.data

      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
