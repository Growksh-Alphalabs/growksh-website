import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startAuth } from '../../lib/cognito'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const register = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      let apiBase = import.meta.env.VITE_API_URL || ''
      // If CI injected the Contact API endpoint (which may include a trailing /contact),
      // normalize to the API root so we can call /auth/register correctly.
      if (apiBase.endsWith('/contact')) apiBase = apiBase.replace(/\/contact$/, '')
      const payload = { email, name, phone }
      console.log('Signup: sending request', { url: `${apiBase}/auth/register`, payload })
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      console.log('Signup: response status', res.status, 'ok?', res.ok)
      try { console.log('Signup: response headers', Object.fromEntries(res.headers.entries())) } catch (e) {}
      
      const contentType = res.headers.get('content-type') || ''
      let data = null
      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        // Non-JSON response (likely HTML error page or plain text)
        const text = await res.text()
        data = { __rawText: text }
      }

      if (res.ok) {
        console.log('Signup succeeded', { data })
        setMessage('User created. Redirecting to verify...')
        try {
          // Try to kick off the custom auth flow so the OTP is sent immediately.
          await startAuth(email)
        } catch (err) {
          console.warn('startAuth (post-register) failed', err)
        }
        // Redirect to login page and prefill email + autostart flag
        navigate(`/auth/login?email=${encodeURIComponent(email)}&autostart=1`)
      } else {
        console.warn('Signup failed', { status: res.status, data })
        // Prefer message from JSON, otherwise show a short snippet of raw text
        const errMsg = (data && data.message) || (data && data.__rawText && data.__rawText.slice(0, 300)) || 'Failed'
        setMessage(`Error ${res.status}: ${errMsg}`)
      }
    } catch (err) {
      // Handle JSON parse failures and other network errors
      console.error('Signup exception', err)
      setMessage(err.message || 'Error')
    } finally { setLoading(false) }
  }


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Sign up</h3>
      <form onSubmit={register} className="space-y-4">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 border rounded" />
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 border rounded" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Mobile (optional)" className="w-full p-3 border rounded" />
        <button disabled={loading} className="w-full py-3 bg-[#00674F] text-white rounded-md font-bold">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      {message && <div className="mt-4 text-sm text-slate-700">{message}</div>}
    </div>
  )
}
