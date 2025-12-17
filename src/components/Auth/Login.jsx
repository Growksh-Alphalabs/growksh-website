import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { startAuth, respondToChallenge, enableFakeAuth } from '../../lib/cognito'

export default function Login() {
  const [email, setEmail] = useState('')
  const [stage, setStage] = useState('start') // start | challenge | success
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  const begin = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await startAuth(email)
      if (res.challenge) setStage('challenge')
      else if (res.success) setStage('success')
    } catch (err) {
      // Show helpful guidance if envs are missing
      const msg = err && err.message ? err.message : 'Failed to start auth'
      setMessage(msg)
      // If the error is missing-config, offer a fast local fallback button
      console.warn('startAuth error', err)
    } finally { setLoading(false) }
  }

  // Auto-start when ?email=...&autostart=1 is present
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const qEmail = searchParams.get('email')
    const auto = searchParams.get('autostart')
    if (qEmail) setEmail(qEmail)
    if (qEmail && auto === '1') {
      begin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const enableFakeAndRetry = async () => {
    enableFakeAuth()
    setMessage('Enabled fake auth for testing — sending code...')
    await begin()
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
      {/* Helpful fallback when Cognito envs are not configured at build time */}
      {message && message.includes('Cognito UserPoolId') && (
        <div className="mt-3">
          <div className="text-sm text-yellow-700">Cognito envs missing in frontend build.</div>
          <button onClick={enableFakeAndRetry} className="mt-2 py-2 px-3 bg-gray-800 text-white rounded">Use fake auth (testing)</button>
        </div>
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
