import React from 'react'

const items = [
  { k: 'P', title: 'Planning for Life Situations', text: 'Comprehensive financial strategies designed for every stage — early career, mid-life, retirement, and legacy planning.' },
  { k: 'E', title: 'Educated Financial Choices', text: 'Empowering you with clear, data-backed insights so every decision feels informed — not impulsive.' },
  { k: 'A', title: 'Achieving Financial Goals', text: 'Helping you reach your life goals — home purchase, child education, financial independence, or early retirement.' },
  { k: 'C', title: 'Create Wealth Mindfully', text: 'Wealth creation that aligns with your values — not just numbers on a spreadsheet.' },
  { k: 'E', title: 'Emotional Support', text: 'Financial guidance during uncertain times — steady advice that keeps you calm and confident.' }
]

export default function Peace() {
  return (
    <section id="peace" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center">Our Signature Approach: Financial P.E.A.C.E. of Mind</h2>
        <p className="mt-3 text-center text-slate-600">A simple, time-tested framework that brings structure and serenity to your financial life.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">{it.k}</div>
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-600 mt-2">{it.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#craft" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold">Let’s Craft Your Financial P.E.A.C.E.</a>
        </div>
      </div>
    </section>
  )
}
