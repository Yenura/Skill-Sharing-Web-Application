import { Suspense } from 'react'
import AdminDashboard from '../../components/Admin/AdminDashboard'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-lg text-gray-600">Loading dashboard...</span>
        </div>
      }>
        <AdminDashboard />
      </Suspense>
    </div>
  )
}
