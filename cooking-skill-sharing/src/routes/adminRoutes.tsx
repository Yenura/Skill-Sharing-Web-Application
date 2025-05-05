import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/Admin/AdminLayout'
import AdminLogin from '../components/Admin/AdminLogin'
import UserManagement from '../components/Admin/UserManagement'
import ContentModeration from '../components/Admin/ContentModeration'
import FeaturedContent from '../components/Admin/FeaturedContent'
import SystemAnnouncements from '../components/Admin/SystemAnnouncements'
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard' // Corrected import name and path
import AdminDashboard from '../components/Admin/AdminDashboard'
import { useAuth } from '../components/Auth/AuthContext' // Corrected import path

export const AdminRoutes = () => {
  const { user, loading } = useAuth() // Get user and loading state

  // Wait until authentication status is determined
  if (loading) {
    return null // Or a loading spinner component
  }

  const isAuthenticated = !!user; // User is authenticated if user object exists
  const isAdmin = user?.isAdmin ?? false; // Check isAdmin property on the user object

  // Redirect logic based on derived values
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    // If authenticated but not admin, redirect to a non-admin page (e.g., home or dashboard)
    // Redirecting to "/" might be appropriate if that's the main app page
    return <Navigate to="/" replace /> 
  }

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="moderation" element={<ContentModeration />} />
        <Route path="featured" element={<FeaturedContent />} />
        <Route path="announcements" element={<SystemAnnouncements />} />
        <Route path="analytics" element={<AnalyticsDashboard />} /> {/* Corrected component name */}
      </Route>
    </Routes>
  )
}
