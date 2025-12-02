import React from 'react'

const steps = [
  { short: 'W', title: 'Welcome & Understand', text: 'Deep discovery conversation to understand your story, life goals, values, and financial reality.' },
  { short: 'E', title: 'Examine & Analyze', text: 'Dive into your financial landscape — income, expenses, assets, liabilities, insurance, and taxation.' },
  { short: 'A', title: 'Architect the Strategy', text: 'Design a comprehensive, goal-based financial plan — practical and aligned to your life stage.' },
  { short: 'L', title: 'Learn Along the Way', text: 'Education is built into our process via practical client sessions so you stay informed.' },
  { short: 'T', title: 'Take Action', text: 'Implementation support — setting up investments, insurance, tax optimizations, step-by-step.' },
  { short: 'H', title: 'Hold & Review', text: 'Structured review sessions to monitor progress, rebalance portfolios and adjust for life changes.' }
]

export default function WealthProcess() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center">The W.E.A.L.T.H. Process™</h2>
        <p className="mt-3 text-center text-slate-600">A structured, experience-driven process that turns financial confusion into clarity — and keeps you supported at every stage of your journey.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">{s.short}</div>
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-slate-600 mt-2">{s.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#book" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold">Book Your Discovery Call</a>
        </div>
      </div>
    </section>
  )
}
