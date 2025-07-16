"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"

let toastId = 0
const toasts = []
const listeners = []

const addToast = (toast) => {
  const id = toastId++
  const newToast = { id, ...toast, createdAt: Date.now() }
  toasts.push(newToast)
  listeners.forEach((listener) => listener([...toasts]))

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)

  return id
}

const removeToast = (id) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index > -1) {
    toasts.splice(index, 1)
    listeners.forEach((listener) => listener([...toasts]))
  }
}

export const toast = {
  success: (message) => addToast({ type: "success", message }),
  error: (message) => addToast({ type: "error", message }),
  warning: (message) => addToast({ type: "warning", message }),
  info: (message) => addToast({ type: "info", message }),
}

export const Toaster = () => {
  const [toastList, setToastList] = useState([])

  useEffect(() => {
    listeners.push(setToastList)
    return () => {
      const index = listeners.indexOf(setToastList)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getBackgroundColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <p className="ml-3 text-sm font-medium text-gray-900 flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
