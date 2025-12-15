import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Wealthcraft',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const apiUrl = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || `Server returned ${res.status}`)
      }

      setSubmitted(true)
      // Open Calendly popup (try react-calendly dynamically, then load widget and fallback)
      try {
        const base = 'https://calendly.com/financialfitnessbygrowksh/financial-fitness-discussion'
        const prefill = {}
        if (form.name) prefill.name = form.name
        if (form.email) prefill.email = form.email

        const loadCalendlyScript = () => new Promise((resolve, reject) => {
          if (window.Calendly) return resolve()
          const s = document.createElement('script')
          s.src = 'https://assets.calendly.com/assets/external/widget.js'
          s.async = true
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Calendly script failed to load'))
          document.body.appendChild(s)
        })

        const calendlyModule = await import('react-calendly').catch(() => null)
        if (calendlyModule && typeof calendlyModule.openPopupWidget === 'function') {
          calendlyModule.openPopupWidget({ url: base, prefill })
          return
        }

        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
          const params = new URLSearchParams()
          if (prefill.name) params.set('name', prefill.name)
          if (prefill.email) params.set('email', prefill.email)
          const calendlyUrl = params.toString() ? `${base}?${params.toString()}` : base
          window.Calendly.initPopupWidget({ url: calendlyUrl })
          return
        }

        // Load the Calendly widget script then call initPopupWidget to show inline popup
        await loadCalendlyScript()
        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
          const params = new URLSearchParams()
          if (prefill.name) params.set('name', prefill.name)
          if (prefill.email) params.set('email', prefill.email)
          const calendlyUrl = params.toString() ? `${base}?${params.toString()}` : base
          window.Calendly.initPopupWidget({ url: calendlyUrl })
          return
        }

        // Final fallback: open in new tab
        const finalUrl = Object.keys(prefill).length ? `${base}?${new URLSearchParams(prefill).toString()}` : base
        window.open(finalUrl, '_blank')
      } catch (e) {
        console.warn('Calendly popup failed to open', e)
      }
    } catch (err) {
      console.error('Contact submission failed', err)
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Let’s Talk About Your <span className="text-[#cf87bf]">Financial Journey</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Book a free discovery call or write to us — we’ll help you find the right starting point within Growksh.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
            {submitted ? (
              <div className="p-6 bg-white rounded-lg border border-slate-100">
                <h3 className="text-lg font-medium">Thanks — we’ve received your request</h3>
                <p className="mt-2 text-slate-600">We'll reach out to you shortly to schedule the discovery call.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <input name="name" value={form.name} onChange={handleChange} required className="mt-0 block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc7f5]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l8.5 6L20 8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                      </svg>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-0 block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc7f5]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.72.36 1.42.72 2.07a1 1 0 0 1-.24 1.09L8.91 8.91a16 16 0 0 0 6 6l1-1a1 1 0 0 1 1.09-.24c.65.36 1.35.6 2.07.72a1 1 0 0 1 .75 1V21z" />
                      </svg>
                      <input name="phone" value={form.phone} onChange={handleChange} className="mt-0 block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc7f5]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">I'm Interested In</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                      <select name="interest" value={form.interest} onChange={handleChange} className="mt-0 block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc7f5]">
                        <option>Advisory</option>
                        <option>Education</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc7f5]" />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-[#3dc7f5] text-white rounded-full font-medium shadow hover:opacity-90 transition-colors ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loading ? 'Sending…' : 'Schedule My Call'}
                  </button>
                  {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                </div>
              </div>
            )}
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <div className="w-full h-80 md:h-80 bg-slate-200">
                <iframe
                  title="Growksh location"
                  src="https://www.google.com/maps?q=kothrud%2C+Pune%2C+Maharashtra&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            <aside className="p-6 rounded-2xl bg-[#2e3b4b] text-white shadow-lg">
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <FaEnvelope className="w-5 h-5 text-white mt-1" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-white/90">Email</div>
                    <Link to="mailto:connect@growksh.com" className="underline">connect@growksh.com</Link>
                  </div>
                </li>

            
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-white mt-1" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-white/90">Office</div>
                    <div>Kothrud, Pune, Maharashtra</div>
                  </div>
                </li>
              </ul>

          
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
