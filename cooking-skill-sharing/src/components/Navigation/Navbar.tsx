'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, isAdminUser } from '@/components/Auth/AuthContext'
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const userNavigation = [
    { name: 'Your Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const adminNavigation = [
    { name: 'User Management', href: '/admin/users' },
    { name: 'Content Moderation', href: '/admin/moderation' },
    { name: 'Featured Content', href: '/admin/featured' },
    { name: 'Analytics', href: '/admin/analytics' },
  ]

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user && isAdminUser(user) ? '/admin/dashboard' : '/dashboard'}>
                <span className="text-2xl font-bold text-orange-600">CookShare</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user && isAdminUser(user) ? (
                // Admin navigation
                adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-orange-600"
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                // User navigation
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-orange-600"
                  >
                    Home
                  </Link>
                  <Link
                    href="/recipe/create"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-orange-600"
                  >
                    Create Recipe
                  </Link>
                  <Link
                    href="/communities"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-orange-600"
                  >
                    Communities
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* Search */}
            <button
              onClick={() => router.push('/search')}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="ml-3 p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden ml-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user && isAdminUser(user) ? (
              // Admin mobile navigation
              adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              // User mobile navigation
              <>
                <Link
                  href="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  href="/recipe/create"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Create Recipe
                </Link>
                <Link
                  href="/communities"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Communities
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
