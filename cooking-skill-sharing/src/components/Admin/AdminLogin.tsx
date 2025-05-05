import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext' // Corrected import path

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Pass email and password as separate arguments
      await login(credentials.email, credentials.password) 
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="relative block w-full rounded-t-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="relative block w-full rounded-b-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
