import { Users, Flag, Star, Bell, BarChart } from 'lucide-react'
import { Link } from 'react-router-dom'

const adminCards = [
  {
    title: 'User Management',
    description: 'Manage users, permissions, and account statuses',
    icon: Users,
    path: '/admin/users',
    stats: '1.2k Users'
  },
  {
    title: 'Content Moderation',
    description: 'Review reported content and moderate submissions',
    icon: Flag,
    path: '/admin/moderation',
    stats: '15 Pending'
  },
  {
    title: 'Featured Content',
    description: 'Manage featured recipes and content',
    icon: Star,
    path: '/admin/featured',
    stats: '3 Featured'
  },
  {
    title: 'Announcements',
    description: 'Create and manage system announcements',
    icon: Bell,
    path: '/admin/announcements',
    stats: '2 Active'
  },
  {
    title: 'Analytics',
    description: 'View site statistics and user analytics',
    icon: BarChart,
    path: '/admin/analytics',
    stats: 'Real-time'
  }
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <card.icon className="h-8 w-8 text-orange-500" />
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                {card.stats}
              </span>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">{card.title}</h2>
            <p className="text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
