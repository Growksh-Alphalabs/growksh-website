import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  initiateAuth,
  verifyOTP,
  checkUserExists,
  resendVerification,
  getUserStatus,
  signOut,
} from '../../lib/cognito'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../assets/Website images/Growksh Logo 1.png'

function safeLower(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined
}

function getEmailVerifiedFromIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') return undefined
  const parts = idToken.split('.')
  if (parts.length !== 3) return undefined
  try {
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(payloadB64))
    return safeLower(payload?.email_verified?.toString())
  } catch {
    return undefined
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
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

      console.info('[Login.handleEmailSubmit] Starting login flow for email:', email)

      // If the backend supports it, check whether the email is registered.
      // If the endpoint is not deployed, we silently skip and proceed with Cognito initiateAuth.
      try {
        console.info('[Login.handleEmailSubmit] Calling /auth/check-user endpoint...')
        const existsRes = await checkUserExists(email)
        console.info('[Login.handleEmailSubmit] check-user response:', existsRes)
        
        if (existsRes && existsRes.exists === false) {
          console.info('[Login.handleEmailSubmit] User does not exist, redirecting to signup')
          navigate(`/auth/signup?email=${encodeURIComponent(email)}`)
          return
        }

        // Only block when the backend explicitly tells us the user is unverified.
        // If the field is missing (older deployments), do NOT block here.
        const emailVerified = safeLower(existsRes?.email_verified)
        console.info('[Login.handleEmailSubmit] pre-auth email_verified status:', emailVerified)

        if (emailVerified === 'false') {
          console.warn('[Login.handleEmailSubmit] User is unverified (email_verified=false), sending magic link')
          try {
            await resendVerification(email)
            console.info('[Login.handleEmailSubmit] Magic link sent successfully')
          } catch (e) {
            console.warn('[Login.handleEmailSubmit] Failed to resend verification (non-fatal):', e.message)
          }

          setErrorMessage(
            'Please verify your email before logging in. We just sent you a magic link again.'
          )
          setLoading(false)
          return
        }
      } catch (err) {
        // Ignore missing endpoint / deployment differences.
        console.warn('[Login.handleEmailSubmit] check-user endpoint not available (non-fatal):', err.message)
      }

      console.info('[Login.handleEmailSubmit] Calling initiateAuth to get OTP...')
      const result = await initiateAuth(email)
      console.info('[Login.handleEmailSubmit] initiateAuth result:', result)

      setSession(result.session)
      setStage('otp')
      setMessage(`OTP sent to ${email}. Please check your email.`)
    } catch (error) {
      console.error('[Login.handleEmailSubmit] Error:', error)

      // Check if user is not registered
      const errorMsg = error.message || ''
      if (
        errorMsg.includes('CreateAuthChallenge failed') ||
        errorMsg.includes('UserNotFound') ||
        errorMsg.includes('User does not exist')
      ) {
        // Redirect to signup with email pre-filled
        navigate(`/auth/signup?email=${encodeURIComponent(email)}`)
        return
      }

      setErrorMessage(
        errorMsg ||
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

      console.info('[Login.handleOTPSubmit] Starting OTP verification for:', email)
      const result = await verifyOTP({
        email,
        otp,
        session,
      })

      console.info('[Login.handleOTPSubmit] OTP response received:', result)

      // Cognito may fail the auth at the trigger level if unverified
      if (!result.AuthenticationResult) {
        console.error('[Login.handleOTPSubmit] No AuthenticationResult in response (likely blocked by trigger)')
        setErrorMessage('Authentication failed. Please verify your email and try again.')
        setLoading(false)
        return
      }

      // Store tokens in localStorage
      const { IdToken, AccessToken, RefreshToken } = result.AuthenticationResult
      console.info('[Login.handleOTPSubmit] Storing tokens in localStorage')
      
      if (IdToken) localStorage.setItem('idToken', IdToken)
      if (AccessToken) localStorage.setItem('accessToken', AccessToken)
      if (RefreshToken) {
        localStorage.setItem('refreshToken', RefreshToken)
      }
      localStorage.setItem('userEmail', email)

      const idTokenEmailVerified = getEmailVerifiedFromIdToken(IdToken)
      console.info('[Login.handleOTPSubmit] idToken email_verified:', idTokenEmailVerified)

      let runtimeEmailVerified = undefined
      try {
        console.info('[Login.handleOTPSubmit] Calling /auth/user-status endpoint...')
        const status = await getUserStatus()
        console.info('[Login.handleOTPSubmit] user-status response:', status)
        runtimeEmailVerified = safeLower(status?.email_verified)
      } catch (e) {
        console.warn('[Login.handleOTPSubmit] user-status check failed (falling back to idToken):', e.message)
      }

      const effectiveEmailVerified = runtimeEmailVerified ?? idTokenEmailVerified
      console.info('[Login.handleOTPSubmit] effective email_verified:', effectiveEmailVerified)

      if (effectiveEmailVerified === 'false') {
        console.error('[Login.handleOTPSubmit] BLOCKING: user is unverified (email_verified=false)')
        
        try {
          console.info('[Login.handleOTPSubmit] Resending verification email...')
          await resendVerification(email)
          console.info('[Login.handleOTPSubmit] Verification email sent successfully')
        } catch (e) {
          console.warn('[Login.handleOTPSubmit] resendVerification failed (non-fatal):', e.message)
        }

        await signOut()
        setStage('email')
        setOtp('')
        setSession('')
        setErrorMessage(
          'Please verify your email before logging in. We just sent you a magic link again.'
        )
        setLoading(false)
        return
      }

      console.info('[Login.handleOTPSubmit] Verification check passed, allowing login')
      // Re-check auth state immediately to update navbar
      await checkAuth()

      setStage('success')
      setMessage('Logged in successfully!')

      // Redirect after 1 second (auth state is already updated)
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error('[Login.handleOTPSubmit] Error during OTP submission:', error)
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
                href="/auth/signup"
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
