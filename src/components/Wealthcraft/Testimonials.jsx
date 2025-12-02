import React from 'react'
import a1 from '../../assets/i1.png'
import a2 from '../../assets/i2.png'
import a3 from '../../assets/i3.png'

const sample = [
  { quote: 'Growksh helped me get clarity and made my money work for my family.', name: 'A. Gupta', avatar: a1, role: 'Senior Manager' },
  { quote: 'Their process is simple and reassuring — I finally feel on track.', name: 'R. Sharma', avatar: a2, role: 'Entrepreneur' },
  { quote: 'Professional, empathetic, and effective. Highly recommended.', name: 'S. Mehta', avatar: a3, role: 'Product Lead' }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      {/* subtle emerald cloud behind the cards */}
      <div aria-hidden="true" className="absolute -left-32 -top-20 w-80 h-80 rounded-full bg-emerald-100/40" style={{ filter: 'blur(64px)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Real <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">People</span>. Real <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">Results</span>.</h2>
          <p className="mt-2 text-slate-600">Stories from clients who found clarity, confidence and better financial outcomes.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {sample.map((s, i) => (
            <figure key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-emerald-200" tabIndex={0}>
              <blockquote className="text-slate-700 text-sm"> 
                <svg className="w-6 h-6 text-emerald-500 inline-block mr-2 -translate-y-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 7h3v7H7zM14 7h3v7h-3z" fill="currentColor" />
                </svg>
                “{s.quote}”
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3">
                <img src={s.avatar} alt={`${s.name} avatar`} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-600">{s.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
