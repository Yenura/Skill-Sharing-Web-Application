'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Auth/AuthContext'
import { Navbar } from '@/components/Navigation/Navbar'
import { RecipeFeed } from '@/components/Recipe/RecipeFeed'
import { RoleSelection } from '@/components/Auth/RoleSelection'

export default function UserDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // If user hasn't selected a role yet, show role selection
  if (!user.role) {
    return <RoleSelection />
  }

  // If user is an admin, redirect to admin dashboard
  if (user.role === 'admin') {
    router.push('/admin/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300">
                  {user.profilePicture && (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push('/recipe/create')}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                >
                  Create Recipe
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Latest
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Following
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Popular
                  </button>
                </div>
              </div>
              <RecipeFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
