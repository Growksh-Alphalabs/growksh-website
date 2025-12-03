import React from 'react'

export default function CTAInline() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-xl font-semibold">Start Your Financial <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">P.E.A.C.E.</span> Journey</h3>
        <p className="mt-2 text-slate-600">Financial freedom begins with clarity. Let’s start with a conversation.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#book"
            aria-label="Schedule a discovery call"
            className="inline-flex w-full sm:w-auto justify-center items-center px-6 py-3 bg-emerald-600 text-white rounded-full"
          >
            Schedule a Discovery Call
          </a>
          <a
            href="#brochure"
            aria-label="Download the Wealthcraft brochure"
            className="inline-flex w-full sm:w-auto justify-center items-center px-6 py-3 border border-slate-200 rounded-full"
          >
            Download the Wealthcraft Brochure
          </a>
        </div>
      </div>
    </div>
  )
}
