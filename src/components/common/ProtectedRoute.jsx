import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute component
 * Only renders children if user is authenticated and is admin (if requireAdmin is true)
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallbackRoute = '/auth/login'
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackRoute} replace />
  }

  // Authenticated but admin required and user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-4">You do not have permission to access this page.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    )
  }

  // All checks passed
  return children
}
