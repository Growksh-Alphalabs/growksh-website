import React from 'react'

const rows = [
  ['A', 'Awareness', 'Start by knowing where you stand — money, mindset, and habits.'],
  ['L', 'Learning by Doing', 'Apply concepts through case studies, simulations, and exercises.'],
  ['P', 'Personal Relevance', 'Learning that maps directly to your life.'],
  ['H', 'Holistic Thinking', 'Personal finance, behavior, and purpose together.'],
  ['A', 'Application for Alpha', 'Turn clarity into measurable growth.']
]

export default function AlphaApproach(){
  return (
    <section className="py-12 bg-rose-50">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">The A.L.P.H.A. Learning Model</h3>
        <p className="text-slate-700 mb-6">Every Alphalabs program follows our signature approach — built around five principles of meaningful learning.</p>
        <div className="grid md:grid-cols-5 gap-4">
          {rows.map(([letter, title, desc]) => (
            <div key={letter} className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-emerald-700">{letter}</div>
              <div className="font-semibold">{title}</div>
              <p className="text-sm text-slate-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <a href="#programs" className="px-5 py-2 bg-yellow-400 rounded-full font-semibold">Join the Next Learning Experience</a>
        </div>
      </div>
    </section>
  )
}
