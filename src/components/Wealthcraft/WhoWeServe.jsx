import React from 'react'

const cards = [
  {
    title: 'Busy Working Professionals',
    body: 'You earn well but don’t have time to organize, track, or optimize your finances. You want to grow into a HNI with a strong investment portfolio, tax efficiency, and early financial freedom.'
  },
  {
    title: 'Independent Women',
    body: 'You’re financially independent but often feel uncertain about whether your decisions are right, safe, or strategic for the long term.'
  },
  {
    title: 'NRIs & Global Indians',
    body: 'You want to create, grow, and protect wealth in India while living abroad. Managing finances across borders feels complex.'
  }
]

export default function WhoWeServe() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center">Who We Work With</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="font-semibold">{c.title}</div>
              <p className="mt-3 text-sm text-slate-600">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
