import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminLogin } from '../../lib/cognito'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../assets/Website images/Growksh Logo 1.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { checkAuth, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchParams] = useSearchParams()

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setMessage('')

    try {
      if (!email.trim()) {
        setErrorMessage('Email is required')
        setLoading(false)
        return
      }

      if (!password.trim()) {
        setErrorMessage('Password is required')
        setLoading(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMessage('Please enter a valid email address')
        setLoading(false)
        return
      }

      console.log('Admin login attempt for:', email)
      const result = await adminLogin(email, password)
      console.log('Admin login result:', result)

      if (result.AuthenticationResult) {
        const { IdToken, AccessToken, RefreshToken } = result.AuthenticationResult
        if (IdToken) localStorage.setItem('idToken', IdToken)
        if (AccessToken) localStorage.setItem('accessToken', AccessToken)
        if (RefreshToken) {
          localStorage.setItem('refreshToken', RefreshToken)
        }
        localStorage.setItem('userEmail', email)

        // Re-check auth state to update context (including admin status)
        await checkAuth()

        setMessage('Admin login successful!')
        
        // Redirect after 1 second (auth state is already updated)
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1000)
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setErrorMessage(
        error.message ||
          'Failed to login. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img
            src={Logo}
            alt="Growksh Logo"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
          <h2 className="text-2xl font-semibold text-gray-700">Admin Login</h2>
          <p className="text-gray-600 mt-2">
            Sign in to admin dashboard
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-600 hover:text-slate-900 underline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
