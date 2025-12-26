import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signup } from '../../lib/cognito'
import Logo from '../../assets/Website images/Growksh Logo 1.png'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [stage, setStage] = useState('form') // form | success | error
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: searchParams.get('email') || '',
    phone_number: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setMessage('')

    // Validate form
    if (!formData.name.trim()) {
      setErrorMessage('Name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setErrorMessage('Email is required')
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Call signup Lambda function
      const response = await signup({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
      })

      console.log('Signup response:', response)

      // Success
      setMessage(
        'Account created successfully! A verification link has been sent to your email. Redirecting to login...'
      )
      setStage('success')

      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login')
      }, 5000)
    } catch (error) {
      console.error('Signup error:', error)
      setStage('error')
      setErrorMessage(
        error.message || 'Failed to create account. Please try again.'
      )
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
          <h2 className="text-2xl font-semibold text-gray-700">Sign Up</h2>
          <p className="text-gray-600 mt-2">
            Create your account to get started
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
                  Account Created Successfully!
                </h3>
                <p className="text-green-700 mt-2">{message}</p>
                <p className="text-sm text-green-600 mt-3">
                  Redirecting to login page in 5 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {stage === 'error' && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 mb-6">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-red-500 mt-0.5"
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
                  Signup Failed
                </h3>
                <p className="text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setStage('form')
                setErrorMessage('')
              }}
              className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Form State */}
        {stage === 'form' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Name Field */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-transparent transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-transparent transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification link to this email
              </p>
            </div>

            {/* Phone Number Field */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] focus:border-transparent transition-colors"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
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
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-[#00674F] hover:text-[#004d39] font-semibold transition-colors"
              >
                Sign In
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
