import { useState, useEffect } from 'react'
import { Search, UserPlus, Edit, Trash2, Shield, AlertTriangle, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '../../components/ui/use-toast'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { adminNavItems } from './AdminLayout'

type User = {
  id: string
  username: string
  email: string
  roles: string[]
  createdAt: string
  status: 'active' | 'suspended' | 'pending'
  profileImageUrl?: string
}

type UserFilters = {
  status: string
  role: string
  search: string
}

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    role: 'all',
    search: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [page, filters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: '10',
        status: filters.status !== 'all' ? filters.status : '',
        role: filters.role !== 'all' ? filters.role : '',
        search: filters.search
      })
      
      const { data, error } = await api.get<{
        content: User[],
        totalPages: number,
        totalElements: number
      }>(`/admin/users?${queryParams}`)
      
      if (error) {
        setError('Failed to fetch users')
        return
      }
      
      setUsers(data.content)
      setTotalPages(data.totalPages)
      setError('')
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      const { error } = await api.delete(`/admin/users/${selectedUser.id}`)
      
      if (error) {
        throw new Error(error)
      }
      
      // If API call is successful, update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id))
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      
      toast({
        title: 'User deleted',
        description: `User ${selectedUser.username} has been deleted`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateUserStatus = async (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    try {
      const { error } = await api.put(`/admin/users/${userId}/status`, { status: newStatus })
      
      if (error) {
        throw new Error(error)
      }
      
      // If API call is successful, update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      )
      
      toast({
        title: 'User status updated',
        description: `User status has been updated to ${newStatus}`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateUserRole = async (userId: string, role: string, isAdd: boolean) => {
    try {
      const action = isAdd ? 'add' : 'remove'
      const { error } = await api.put(`/admin/users/${userId}/roles/${action}`, { role })
      
      if (error) {
        throw new Error(error)
      }
      
      // If API call is successful, update local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === userId) {
            const updatedRoles = isAdd
              ? [...user.roles, role]
              : user.roles.filter(r => r !== role)
            return { ...user, roles: updatedRoles }
          }
          return user
        })
      )
      
      toast({
        title: 'User role updated',
        description: `Role ${role} has been ${isAdd ? 'added to' : 'removed from'} user`,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      })
    }
  }

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filters change
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Suspended
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Shield className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      default:
        return null
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
        <span className="ml-2 text-lg text-gray-600">Loading users...</span>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-2 rounded bg-red-100 px-3 py-1 text-sm hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/admin" className="hover:text-orange-600">Admin</Link></li>
          <li>/</li>
          <li className="text-gray-900">User Management</li>
        </ol>
      </nav>

      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                item.path === '/admin/users'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9 rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All Roles</option>
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <button
            className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Roles
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.profileImageUrl ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.profileImageUrl}
                          alt={user.username}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {renderStatusBadge(user.status)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span key={role} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${
                page === 1
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${
                page === totalPages
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete user <span className="font-semibold">{selectedUser.username}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
