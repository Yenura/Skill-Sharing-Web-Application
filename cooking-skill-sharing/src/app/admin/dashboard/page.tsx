'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Auth/AuthContext'
import { Navbar } from '@/components/Navigation/Navbar'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else if (!user.isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Management Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">Manage user accounts and roles</p>
            <button
              onClick={() => router.push('/admin/users')}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              View Users
            </button>
          </div>

          {/* Content Moderation Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Content Moderation</h3>
            <p className="text-gray-600 mb-4">Review and moderate user content</p>
            <button
              onClick={() => router.push('/admin/moderation')}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              View Content
            </button>
          </div>

          {/* Featured Content Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Content</h3>
            <p className="text-gray-600 mb-4">Manage featured recipes and users</p>
            <button
              onClick={() => router.push('/admin/featured')}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Manage Featured
            </button>
          </div>

          {/* Analytics Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics</h3>
            <p className="text-gray-600 mb-4">View platform analytics and metrics</p>
            <button
              onClick={() => router.push('/admin/analytics')}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Activity items would be mapped here */}
            <div className="text-gray-600">No recent activity to display</div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700">System Health</h4>
              <p className="text-green-600">All systems operational</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700">Active Users</h4>
              <p className="text-blue-600">Loading...</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-700">New Reports</h4>
              <p className="text-orange-600">No pending reports</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
