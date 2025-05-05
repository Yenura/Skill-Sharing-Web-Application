'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Auth/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        router.push(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
      }
    }
  }, [user, loading, router])

  // Return null since this is just a routing page
  return null
}
