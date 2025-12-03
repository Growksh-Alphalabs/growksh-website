import React from 'react'

const testimonials = [
  {
    name: 'Neha Gangrade',
    quote: `Thank you Growksh team, specially Krutika, for providing help and support at each and every step in my journey of learning basics about trading. You guys have been extremely patient in answering all the queries.`,
    role: 'Learner',
  },
  {
    name: 'Satyawan Aglawe',
    quote: `Hi Growksh team, first of all thank you So much for all your support and handholding. You made trading so easy that anybody can do it and enjoy the freedom of time and money in long run. You guys are simply awesome, kind hearted and always ready to help. You are strategic thinkers, and your system oriented approach is a must learn for everyone. More blessings and power to you to touch many more lives !! Thank you so much for all the knowledge and help !!`,
    role: 'Learner',
  }
]

export default function Testimonials(){
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-extrabold mb-6 text-slate-900">Learners Who Found Their Alpha</h3>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <article key={i} className="relative bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-emerald-100 flex items-center justify-center text-xl font-semibold text-violet-700">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-slate-500">{t.role}</div>
                  <p className="mt-3 text-slate-800 text-sm leading-relaxed">“{t.quote}”</p>
                  <div className="mt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-slate-900 border border-slate-100">{t.name}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
