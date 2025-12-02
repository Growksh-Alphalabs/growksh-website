import React from 'react'
import { COLORS } from '../../constants/colors'
import img from '../../assets/2.jpg'

export default function WhatWeDo() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight animate-fadeUp">Life changes. <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-400">Your money should move with it.</span></h2>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed animate-fadeUp" style={{ animationDelay: '120ms' }}>
              At Growksh Wealthcraft, we don’t just create plans — we craft financial frameworks that move with your life. 
            </p>

              <p className="mt-6 text-lg text-slate-600 leading-relaxed animate-fadeUp" style={{ animationDelay: '120ms' }}>
              Our goal is simple: to give you complete clarity and control over your money, so you can live with confidence and purpose.
            </p>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed animate-fadeUp" style={{ animationDelay: '220ms' }}>
              Whether you’re a working professional managing multiple goals, a woman balancing priorities, or an NRI planning across borders — we help you bring structure, direction, and peace to your financial life.
            </p>

           

            <div className="mt-8 animate-fadeUp" style={{ animationDelay: '380ms' }}>
              <a
                href="#consult"
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                style={{ backgroundColor: COLORS.EMERALD_GREEN }}
                aria-label="Get started with a free consultation"
              >
                Get Started — Free Consultation
              </a>
            </div>
          </div>

          {/* Right: illustration / image */}
          <div className="relative">
            <div className="bg-emerald-50 rounded-2xl p-6 shadow-lg overflow-hidden">
              <div className="relative rounded-xl bg-white/60 border border-emerald-100 p-4">
                {/* Decorative emerald smoke / blob */}
                <div className="absolute -right-8 -top-6 w-48 h-48 bg-emerald-200/30 rounded-full filter blur-3xl opacity-80 pointer-events-none" aria-hidden="true" />

                <img
                  src={img}
                  alt="Wealth planning illustration"
                  className="w-full h-56 object-cover rounded-md shadow-sm"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeUp { animation: fadeUp 560ms cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .animate-fadeUp { animation: none; } .animate-fadeUp[style] { animation: none !important; } }
        .blur-3xl { filter: blur(40px); }
      `}</style>
    </section>
  )
}
