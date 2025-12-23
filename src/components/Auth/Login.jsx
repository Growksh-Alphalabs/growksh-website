import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { initiateAuth, verifyOTP } from '../../lib/cognito'

export default function Login() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('email') // email | otp | success
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [session, setSession] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Auto-populate email from query params
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const qEmail = searchParams.get('email')
    if (qEmail) {
      setEmail(qEmail)
    }
  }, [searchParams])

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

      console.log('Initiating auth for:', email)
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
      setStage('success')
      setMessage('Logged in successfully!')

      // Store tokens in localStorage
      if (result.AuthenticationResult) {
        const { IdToken, AccessToken, RefreshToken } = result.AuthenticationResult
        if (IdToken) localStorage.setItem('idToken', IdToken)
        if (AccessToken) localStorage.setItem('accessToken', AccessToken)
        if (RefreshToken) {
          localStorage.setItem('refreshToken', RefreshToken)
        }
        localStorage.setItem('userEmail', email)
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Growksh</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Sign In</h2>
          <p className="text-gray-600 mt-2">
            Enter your email to sign in
          </p>
        </div>

        {/* Success State */}
        {stage === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mt-0.5"
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
                  Logged In Successfully!
                </h3>
                <p className="text-green-700 mt-2">{message}</p>
                <p className="text-sm text-green-600 mt-3">
                  Redirecting to home page...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email Entry Form */}
        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-transparent transition-colors"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Info Message */}
            {message && !errorMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00674F] text-white font-bold rounded-lg hover:bg-[#004d39] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
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
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-[#00674F] hover:text-[#004d39] font-semibold transition-colors"
              >
                Sign Up
              </a>
            </p>
          </form>
        )}

        {/* OTP Entry Form */}
        {stage === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Info Message */}
            {message && !errorMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            )}

            {/* OTP Field */}
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                One-Time Password
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-transparent transition-colors text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-[#00674F] text-white font-bold rounded-lg hover:bg-[#004d39] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
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
                    Verifying...
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage('email')
                  setOtp('')
                  setErrorMessage('')
                  setMessage('')
                }}
                className="py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
