import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/Auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Home,
  Search,
  PlusCircle,
  Users,
  User,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  ChefHat,
  Bookmark,
  MessageSquare,
} from 'lucide-react'

export const MainNav = () => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const response = await fetch('/api/notifications/unread-count')
          const data = await response.json()
          setUnreadNotifications(data.count)
        } catch (error) {
          console.error('Failed to fetch unread notifications:', error)
        }
      }
    }

    fetchUnreadCount()
  }, [user])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/create', label: 'Create', icon: PlusCircle },
    { href: '/communities', label: 'Communities', icon: Users },
  ]

  const userMenuItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/saved', label: 'Saved Recipes', icon: Bookmark },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">CookingShare</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-orange-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-1" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/notifications"
                className="p-2 text-gray-500 hover:text-gray-700 relative"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile dropdown */}
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                  >
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="ml-3 flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {userMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
