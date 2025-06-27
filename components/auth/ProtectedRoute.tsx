'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen } from 'lucide-react'

interface ProtectedRouteProps {
  readonly children: React.ReactNode
  readonly redirectTo?: string
  readonly requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        router.push('/library')
      }
    }
  }, [user, loading, router, redirectTo, requireAuth])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-fantasy-gold/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 text-primary-600 animate-pulse mx-auto" />
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if authentication check fails
  if (requireAuth && !user) {
    return null
  }

  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string; requireAuth?: boolean }
) {
  const ProtectedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  )

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName ?? Component.name})`
  
  return ProtectedComponent
}
