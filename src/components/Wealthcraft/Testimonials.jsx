import React from 'react'

const sample = [
  { quote: 'Growksh helped me get clarity and made my money work for my family.', name: 'A. Gupta' },
  { quote: 'Their process is simple and reassuring — I finally feel on track.', name: 'R. Sharma' },
  { quote: 'Professional, empathetic, and effective. Highly recommended.', name: 'S. Mehta' }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold">Real People. Real Results.</h2>
        <div className="mt-8 space-y-6">
          {sample.map((s, i) => (
            <blockquote key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-slate-700">“{s.quote}”</p>
              <div className="mt-3 text-sm font-medium text-slate-600">— {s.name}</div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
