import React, { useState } from 'react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const form = new FormData(e.target)
      const data = Object.fromEntries(form.entries())

      const apiUrl = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${res.status}`)
      }

      setSuccess(true)
      e.target.reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.')
      console.error('Contact form error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input name="name" required className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input name="phone" className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">I'm interested in</span>
          <select name="interest" className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50">
            <option>Alphalabs</option>
            <option>Wealthcraft</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Message</span>
        <textarea name="message" rows={6} className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50"></textarea>
      </label>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Thanks — we received your message. We'll get back to you soon!
        </div>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-[#00674F] text-white px-5 py-2 rounded-lg shadow-sm hover:bg-[#005e48] focus:outline-none focus:ring-2 focus:ring-[#00674F]/40 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Sending…' : 'Schedule My Call'}
        </button>
        <span className="text-sm text-slate-600">Or email us at <a href="mailto:hello@growksh.com" className="text-[#00674F] underline">hello@growksh.com</a></span>
      </div>
    </form>
  )
}
