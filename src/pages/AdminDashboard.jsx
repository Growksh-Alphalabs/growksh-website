import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { listUsers, resendVerificationLink } from '../lib/cognito'

export default function AdminDashboard() {
  const { user, logout, getIdToken } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [usersMessage, setUsersMessage] = useState('')

  const unverifiedUsers = useMemo(
    () => users.filter((u) => u && u.email && u.email_verified !== 'true'),
    [users]
  )

  const handleLogout = async () => {
    const ok = window.confirm('Logout now?')
    if (!ok) return
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUsers = async () => {
    setLoadingUsers(true)
    setUsersError('')
    setUsersMessage('')
    try {
      const token = await getIdToken()
      const res = await listUsers({ idToken: token, limit: 25 })
      setUsers(Array.isArray(res?.users) ? res.users : [])
    } catch (e) {
      setUsersError(e?.message || 'Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    refreshUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResendMagicLink = async (email) => {
    setUsersError('')
    setUsersMessage('')
    try {
      const res = await resendVerificationLink(email)
      if (res?.sent) {
        setUsersMessage(`Magic link sent to ${email}`)
      } else {
        setUsersMessage(res?.message || 'Request completed')
      }
    } catch (e) {
      setUsersError(e?.message || 'Failed to send magic link')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome, {user?.name || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">User Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Email</label>
              <p className="text-lg text-slate-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Name</label>
              <p className="text-lg text-slate-900">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Phone</label>
              <p className="text-lg text-slate-900">{user?.phone_number || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Email Verified</label>
              <p className="text-lg text-slate-900">
                {user?.email_verified === 'true' ? (
                  <span className="text-green-600 font-semibold">✓ Yes</span>
                ) : (
                  <span className="text-red-600 font-semibold">✗ No</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-600">Total Users</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{users.length || '—'}</p>
            <p className="text-xs text-slate-500 mt-2">Last 25 users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-600">Total Messages</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">—</p>
            <p className="text-xs text-slate-500 mt-2">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-slate-600">Active Sessions</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
            <p className="text-xs text-slate-500 mt-2">Current session</p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Users</h2>
              <p className="text-sm text-slate-600">Send magic link only to unverified emails</p>
            </div>
            <button
              type="button"
              onClick={refreshUsers}
              disabled={loadingUsers}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loadingUsers ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {usersError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{usersError}</p>
            </div>
          )}

          {usersMessage && !usersError && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{usersMessage}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Verified</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {unverifiedUsers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-600" colSpan={3}>
                      No unverified users in the last 25.
                    </td>
                  </tr>
                ) : (
                  unverifiedUsers.map((u) => (
                    <tr key={u.username || u.email}>
                      <td className="px-4 py-4 text-sm text-slate-900">{u.email}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600" />
                          <span className="text-slate-700">No</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleResendMagicLink(u.email)}
                          className="text-sm font-semibold text-slate-800 hover:underline"
                        >
                          Send magic link
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}
