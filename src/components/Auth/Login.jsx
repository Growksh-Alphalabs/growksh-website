import React, { useState } from 'react'
import { startAuth, respondToChallenge } from '../../lib/cognito'

export default function Login() {
  const [email, setEmail] = useState('')
  const [stage, setStage] = useState('start') // start | challenge | success
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  const begin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await startAuth(email)
      if (res.challenge) setStage('challenge')
      else if (res.success) setStage('success')
    } catch (err) {
      setMessage(err.message || 'Failed to start auth')
    } finally { setLoading(false) }
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await respondToChallenge(email, otp)
      if (res.success) {
        setStage('success')
        setMessage('Signed in')
        // store tokens if needed: res.session.getIdToken().getJwtToken()
      }
    } catch (err) {
      setMessage(err.message || 'Invalid code')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Sign in (Email OTP)</h3>

      {stage === 'start' && (
        <form onSubmit={begin} className="space-y-4">
          <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 border rounded" />
          <button disabled={loading} className="w-full py-3 bg-[#00674F] text-white rounded-md font-bold">{loading ? 'Sending code...' : 'Send code'}</button>
        </form>
      )}

      {stage === 'challenge' && (
        <form onSubmit={submitOtp} className="space-y-4">
          <div className="text-sm text-slate-600">We sent a one-time code to your email.</div>
          <input required value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter code" className="w-full p-3 border rounded" />
          <div className="flex gap-2">
            <button disabled={loading} className="flex-1 py-3 bg-[#00674F] text-white rounded-md font-bold">{loading ? 'Verifying...' : 'Verify code'}</button>
            <button type="button" onClick={() => setStage('start')} className="py-3 px-4 border rounded-md">Change email</button>
          </div>
        </form>
      )}

      {stage === 'success' && (
        <div className="text-green-600 font-semibold">Signed in successfully.</div>
      )}

      {message && <div className="mt-4 text-sm text-slate-700">{message}</div>}
    </div>
  )
}
