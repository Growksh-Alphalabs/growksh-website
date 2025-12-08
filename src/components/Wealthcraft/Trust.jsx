import React from 'react'
import img1 from '../../assets/Website images/Wealthcraft - sebi logo.png'
import img2 from '../../assets/Website images/Wealthcraft - Comprehensive Approach.png'
import img3 from '../../assets/Website images/Wealthcraft - customised planning.png'
import img4 from '../../assets/Website images/Wealthcraft - Partnership for Life.png' 

export default function Trust() {
  const items = [
    {
      title: 'SEBI Registered · Fee-Only Advice',
      desc: 'Transparent and unbiased, free from commission conflicts.',
      image: img1
    },
    {
      title: 'Comprehensive Approach',
      desc: 'We integrate investments, tax, insurance, and life goals.',
      image: img2
    },
    {
      title: 'Customized Planning',
      desc: 'Every plan is custom-built — never off-the-shelf.',
      image: img3
    },
    {
      title: 'Partnership for Life',
      desc: 'We\'re not a one-time consultant — we\'re your lifelong financial partner.',
      image: img4
    }
  ]

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Full-width decorative yellow clouds */}
      <div aria-hidden="true" className="absolute -left-40 -top-20 w-72 h-72 rounded-full bg-[#ffde21]/40" style={{ filter: 'blur(80px)' }} />
      <div aria-hidden="true" className="absolute -right-40 -bottom-24 w-80 sm:w-96 lg:w-[32rem] rounded-full bg-[#ffde21]/30" style={{ filter: 'blur(120px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Our Clients Choose to Stay With Us for Years</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" role="list">
          {items.map((it, idx) => (
            <article
              key={it.title}
              role="listitem"
              tabIndex={0}
              className="group bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffde21]/30 hover:shadow-md hover:border-[#ffde21]/50 transition-all duration-300 h-full flex flex-col overflow-hidden"
              aria-labelledby={`trust-${idx}`}
            >
              {/* Image at the top */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={it.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a colored div if image fails to load
                    e.target.style.display = 'none'
                    e.target.parentElement.style.backgroundColor = '#ffde21'
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"></div></div>'
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                <h3 id={`trust-${idx}`} className="text-lg font-bold text-slate-900 mb-2">{it.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}