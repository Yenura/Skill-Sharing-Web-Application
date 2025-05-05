import { Outlet } from 'react-router-dom'
import { Users, Shield, Star, Bell, BarChart } from 'lucide-react'

export const adminNavItems = [
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Shield, label: 'Content Moderation', path: '/admin/moderation' },
  { icon: Star, label: 'Featured Content', path: '/admin/featured' },
  { icon: Bell, label: 'System Announcements', path: '/admin/announcements' },
  { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
]

export default function AdminLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <Outlet />
    </div>
  )
}
