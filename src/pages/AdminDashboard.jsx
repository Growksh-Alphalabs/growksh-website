import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
            <p className="text-3xl font-bold text-slate-900 mt-2">—</p>
            <p className="text-xs text-slate-500 mt-2">Coming soon</p>
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

        {/* Features List */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Available Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
              <span className="text-slate-700">User Management</span>
              <span className="ml-2 text-xs text-slate-500">(Coming soon)</span>
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
              <span className="text-slate-700">Content Management</span>
              <span className="ml-2 text-xs text-slate-500">(Coming soon)</span>
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
              <span className="text-slate-700">Analytics</span>
              <span className="ml-2 text-xs text-slate-500">(Coming soon)</span>
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
              <span className="text-slate-700">Reports</span>
              <span className="ml-2 text-xs text-slate-500">(Coming soon)</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
