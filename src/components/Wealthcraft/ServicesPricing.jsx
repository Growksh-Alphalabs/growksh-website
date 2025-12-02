import React from 'react'

export default function ServicesPricing() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center">Choose How You’d Like to Work With Us</h2>
        <p className="mt-3 text-center text-slate-600">We designed two flexible engagement models — so you choose what fits your lifestyle, goals, and comfort.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold">Model 1: Ad-Hoc Consultation</h3>
            <p className="mt-2 text-sm text-slate-600">Best for one-time planning decisions or focused help on a specific area.</p>
            <div className="mt-4 text-sm text-slate-700">Sample services and prices can be listed here.</div>
            <div className="mt-4">
              <a href="#adhoc" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full">Book an Ad-hoc Consultation</a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold">Model 2: Retainer Plans</h3>
            <p className="mt-2 text-sm text-slate-600">Stay partnered, stay planned — ongoing support and periodic reviews.</p>
            <div className="mt-4 text-sm text-slate-700">Registration Fee: ₹ 999 (one-time)</div>
            <div className="mt-4">
              <a href="#retainer" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full">Join a Retainer Plan</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
