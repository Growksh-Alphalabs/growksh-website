import React from 'react'

export default function Trust() {
  const items = [
    {
      title: 'SEBI Registered · Fee-Only Advice',
      desc: 'Transparent and unbiased, free from commission conflicts.'
    },
    {
      title: 'Comprehensive Approach',
      desc: 'We integrate investments, tax, insurance, and life goals.'
    },
    {
      title: 'Customized Planning',
      desc: 'Every plan is custom-built — never off-the-shelf.'
    },
    {
      title: 'Partnership for Life',
      desc: 'We’re not a one-time consultant — we’re your lifelong financial partner.'
    }
  ]

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Full-width decorative emerald clouds */}
      <div aria-hidden="true" className="absolute -left-40 -top-20 w-96 h-96 rounded-full bg-emerald-200/40" style={{ filter: 'blur(80px)', transform: 'scale(1.2)' }} />
      <div aria-hidden="true" className="absolute -right-40 -bottom-24 w-[520px] h-[520px] rounded-full bg-emerald-100/30" style={{ filter: 'blur(120px)', transform: 'scale(1.05)' }} />

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Our Clients Choose to Stay With Us for Years</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10" role="list">
          {items.map((it, idx) => (
            <article
              key={it.title}
              role="listitem"
              tabIndex={0}
              className="group bg-white border border-emerald-50 rounded-xl p-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 hover:shadow-md"
              aria-labelledby={`trust-${idx}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div>
                  <h3 id={`trust-${idx}`} className="text-sm font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{it.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
