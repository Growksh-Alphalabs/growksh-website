import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { initiateAuth, verifyOTP } from '../../lib/cognito'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../assets/Website images/Growksh Logo 1.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { checkAuth, isAuthenticated, isAdmin } = useAuth()
  const [stage, setStage] = useState('email') // email | otp | success
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [session, setSession] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard')
    }
  }, [isAuthenticated, isAdmin, navigate])

  const handleEmailSubmit = async (e) => {
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

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMessage('Please enter a valid email address')
        setLoading(false)
        return
      }

      console.log('Initiating admin auth for:', email)
      const result = await initiateAuth(email)
      console.log('Auth initiated:', result)

      setSession(result.session)
      setStage('otp')
      setMessage(`OTP sent to ${email}. Please check your email.`)
    } catch (error) {
      console.error('Auth error:', error)
      setErrorMessage(
        error.message ||
          'Failed to initiate login. Please check your email and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setMessage('')

    try {
      if (!otp.trim()) {
        setErrorMessage('OTP is required')
        setLoading(false)
        return
      }

      if (otp.length !== 6) {
        setErrorMessage('OTP must be 6 digits')
        setLoading(false)
        return
      }

      console.log('Verifying OTP for:', email)
      const result = await verifyOTP({
        email,
        otp,
        session,
      })

      console.log('OTP verified, result:', result)

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

        setStage('success')
        setMessage('Logged in successfully!')

        // Redirect after 1 second (auth state is already updated)
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1000)
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setErrorMessage(error.message || 'Invalid OTP. Please try again.')
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
            Passwordless verification for admin access
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

        {/* Email Stage */}
        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* OTP Stage */}
        {stage === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Enter the 6-digit OTP sent to <strong>{email}</strong>
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                One-Time Password
              </label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage('email')
                setOtp('')
                setSession('')
                setMessage('')
              }}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
          </form>
        )}

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
