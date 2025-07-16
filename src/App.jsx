import { Routes, Route } from "react-router-dom"
import { Toaster } from "./components/ui/Toaster"
import Navbar from "./components/layout/Navbar"
import HomePage from "./pages/HomePage"
import StackDetailPage from "./pages/StackDetailPage"
import BookmarksPage from "./pages/BookmarksPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ContributePage from "./pages/ContributePage"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stack/:id" element={<StackDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contribute"
            element={
              <ProtectedRoute>
                <ContributePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App
