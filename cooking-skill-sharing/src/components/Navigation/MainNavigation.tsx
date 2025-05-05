import { useState, useEffect } from 'react' // Import useEffect
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserGroupIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon, // Icon for Goals & Timeline (using ChartBar as a placeholder)
} from '@heroicons/react/24/outline'
import NotificationsPanel from '../Notifications/NotificationsPanel'

export default function MainNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [mounted, setMounted] = useState(false); // Add mounted state

  // Set mounted to true after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data - replace with actual user data from context/state management
  const user = {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  }

  // Mock data - replace with actual notification count from context/state management
  const unreadNotificationsCount = 3

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon }, // Changed Home to Dashboard
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
    { name: 'Create Recipe', href: '/recipe/create', icon: PlusCircleIcon }, // Changed Upload to Create Recipe
    { name: 'Communities', href: '/communities', icon: UserGroupIcon },
    { name: 'Profile', href: `/profile/${user.id}`, icon: UserIcon },
    // Added Goals & Timeline - assuming a page exists or will exist
    { name: 'Goals & Timeline', href: '/goals', icon: ChartBarIcon }, // Placeholder path and icon
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
  }

  // Render null on the server to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center"> {/* Link to public landing/feed */}
                <Image
                  src="/globe.svg"
                  alt="Cooking Skill-Sharing"
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-auto dark:invert"
                />
                <span className="ml-2 text-xl font-bold text-blue-600">CookingShare</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-1 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Notifications and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <NotificationsPanel />
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-3">
              <Link href={`/profile/${user.id}`} className="flex items-center">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="ml-3 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
