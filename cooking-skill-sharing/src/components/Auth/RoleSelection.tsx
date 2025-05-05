import { useRouter } from 'next/navigation'
import { useAuth, isAdminUser } from './AuthContext'

export const RoleSelection = () => {
  const router = useRouter()
  const { user, updateUserRole } = useAuth()

  const handleRoleSelect = async (role: 'user' | 'admin') => {
    try {
      await updateUserRole(role)
      router.push(role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to use CookShare
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleRoleSelect('user')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Continue as User
            <span className="ml-2 text-sm text-orange-200">
              Share recipes and learn from others
            </span>
          </button>

          {isAdminUser(user) && (
            <button
              onClick={() => handleRoleSelect('admin')}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Continue as Admin
              <span className="ml-2 text-sm text-gray-300">
                Manage platform and users
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
