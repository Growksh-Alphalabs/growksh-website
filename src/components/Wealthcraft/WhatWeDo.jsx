import React from 'react'
import { COLORS } from '../../constants/colors'

export default function WhatWeDo() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight animate-fadeUp">Life changes. Your money should move with it.</h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed animate-fadeUp" style={{ animationDelay: '120ms' }}>
            At Growksh Wealthcraft, we don’t just create plans — we craft financial frameworks that move with your life. Our goal is simple: to give you complete clarity and control over your money, so you can live with confidence and purpose.
          </p>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed animate-fadeUp" style={{ animationDelay: '220ms' }}>
            Whether you’re a working professional managing multiple goals, a woman balancing priorities, or an NRI planning across borders — we help you bring structure, direction, and peace to your financial life.
          </p>

          <div className="mt-8 animate-fadeUp" style={{ animationDelay: '340ms' }}>
            <a
              href="#consult"
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white shadow-md"
              style={{ backgroundColor: COLORS.EMERALD_GREEN }}
            >
              Get Started with a Free Consultation
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeUp { animation: fadeUp 560ms cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .animate-fadeUp { animation: none; } }
      `}</style>
    </section>
  )
}
