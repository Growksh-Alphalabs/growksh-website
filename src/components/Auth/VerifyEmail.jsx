import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const emailParam = searchParams.get('email')
        const token = searchParams.get('token')
        const timestamp = searchParams.get('t')

        if (!emailParam || !token || !timestamp) {
          setStatus('error')
          setMessage('Invalid verification link. Missing required parameters.')
          setLoading(false)
          return
        }

        // Call the backend verification endpoint
        const runtime = (typeof window !== 'undefined' && window.__GROWKSH_RUNTIME_CONFIG__) || {}
        const apiUrl = (runtime.VITE_API_URL || import.meta.env.VITE_API_URL || '').toString().trim()

        if (!apiUrl) {
          throw new Error('API_URL is not configured')
        }

        let apiBase = apiUrl.replace(/\/+$/, '')
        // CloudFormation exports already include the complete URL with stage
        // So we should NOT add /Prod or any other stage

        const response = await fetch(
          `${apiBase}/auth/verify-email?email=${encodeURIComponent(
            emailParam
          )}&token=${token}&t=${timestamp}`
        )

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(
            'Your email has been verified successfully! Redirecting to login...'
          )
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate(`/login?email=${encodeURIComponent(emailParam)}&verified=1`)
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. Please try signing up again.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage(
          'An error occurred during verification. Please check your connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Growksh</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Verify Email</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-12 w-12 text-[#00674F]" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">{message}</p>
          </div>
        )}

        {/* Success State */}
        {!loading && status === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
            <div className="flex items-start">
              <svg
                className="h-8 w-8 text-green-500 mt-0.5"
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
                <h3 className="text-lg font-medium text-green-800">
                  Email Verified!
                </h3>
                <p className="text-green-700 mt-2">{message}</p>
                <p className="text-sm text-green-600 mt-3">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && status === 'error' && (
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-red-500">
            <div className="flex items-start">
              <svg
                className="h-8 w-8 text-red-500 mt-0.5"
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
                <h3 className="text-lg font-medium text-red-800">
                  Verification Failed
                </h3>
                <p className="text-red-700 mt-2">{message}</p>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                  >
                    Back to Sign Up
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
