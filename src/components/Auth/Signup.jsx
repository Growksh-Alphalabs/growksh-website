import React, { useState } from 'react'

export default function Signup() {
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
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone })
      })
      console.log({res});
      
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
        setMessage('User created. Now sign in to receive OTP.')
      } else {
        // Prefer message from JSON, otherwise show a short snippet of raw text
        const errMsg = (data && data.message) || (data && data.__rawText && data.__rawText.slice(0, 300)) || 'Failed'
        setMessage(`Error ${res.status}: ${errMsg}`)
      }
    } catch (err) {
      // Handle JSON parse failures and other network errors
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
