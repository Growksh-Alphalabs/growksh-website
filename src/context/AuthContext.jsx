import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as cognitoLib from '../lib/cognito'

// Create Auth Context
const AuthContext = createContext(null)

/**
 * AuthProvider component
 * Manages authentication state and provides auth functions to children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const currentUser = await cognitoLib.getCurrentUser()
        if (currentUser) {
          try {
            const attributes = await cognitoLib.getUserAttributes()
            // If session is stale, getUserAttributes() may return null.
            if (!attributes) {
              setUser(null)
              setIsAuthenticated(false)
              return
            }

            setUser({
              ...currentUser,
              ...attributes,
            })
            setIsAuthenticated(true)
          } catch (attrErr) {
            const msg = (attrErr && attrErr.message) || ''
            if (msg.toLowerCase().includes('not authenticated')) {
              try { await cognitoLib.signOut() } catch (e) {}
              setUser(null)
              setIsAuthenticated(false)
              return
            }
            throw attrErr
          }
        } else {
          // Check for fake auth tokens
          const token = localStorage.getItem('idToken')
          const email = localStorage.getItem('userEmail')
          if (token && token !== 'undefined' && email) {
            setUser({ email, isAuthenticated: true })
            setIsAuthenticated(true)
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Signup handler
  const handleSignup = useCallback(async (userData) => {
    try {
      setError(null)
      setIsLoading(true)
      const result = await cognitoLib.signup(userData)
      return result
    } catch (err) {
      const errorMsg = err.message || 'Signup failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initiate auth handler
  const handleInitiateAuth = useCallback(async (email) => {
    try {
      setError(null)
      setIsLoading(true)
      const result = await cognitoLib.initiateAuth(email)
      return result
    } catch (err) {
      const errorMsg = err.message || 'Failed to initiate authentication'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify OTP handler
  const handleVerifyOTP = useCallback(async (email, otp, session) => {
    try {
      setError(null)
      setIsLoading(true)
      const result = await cognitoLib.verifyOTP({ email, otp, session })

      // Update user state on successful verification
      if (result.success || result.AuthenticationResult) {
        setUser({ email })
        setIsAuthenticated(true)
        localStorage.setItem('userEmail', email)
      }

      return result
    } catch (err) {
      const errorMsg = err.message || 'OTP verification failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      await cognitoLib.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (err) {
      const errorMsg = err.message || 'Logout failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get ID token
  const getIdToken = useCallback(async () => {
    try {
      return await cognitoLib.getIdToken()
    } catch (err) {
      console.error('Error getting ID token:', err)
      throw err
    }
  }, [])

  // Refresh tokens
  const refreshToken = useCallback(async () => {
    try {
      setError(null)
      return await cognitoLib.refreshTokens()
    } catch (err) {
      const errorMsg = err.message || 'Token refresh failed'
      setError(errorMsg)
      throw err
    }
  }, [])

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    signup: handleSignup,
    initiateAuth: handleInitiateAuth,
    verifyOTP: handleVerifyOTP,
    logout: handleLogout,
    getIdToken,
    refreshToken,

    // Clear error
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use Auth Context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
