import React from 'react'
import { Link } from 'react-router-dom'

// Using curated Unsplash images for the preview cards.
const img1 = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
const img2 = 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80'
const img3 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBWMumDfeuDl0jyFEmRitQvDLBBrhPexQopQ&s'

const posts = [
  {
    title: '5 money habits of financially fit professionals',
    excerpt: 'Small consistent habits compound into long-term financial strength — practical routines you can start today.'
    ,
    image: img1
  },
  {
    title: 'Why women need a separate financial plan',
    excerpt: 'Designing plans that reflect different life stages, risks, and goals leads to better outcomes for women.'
    ,
    image: img2
  },
  {
    title: 'Cashflow mistakes professionals make',
    excerpt: 'Common cashflow pitfalls and simple fixes to keep your finances resilient and goal-aligned.'
    ,
    image: img3
  }
]

export default function InsightsPreview() {
  return (
    <section className="py-16 bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center">
             <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Insights to Keep You <span className="text-[#cf87bf]">Financially Fit</span>
            </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Read our latest articles and guides on personal finance, investments, and wealth planning.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <article
              key={p.title}
              className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="w-full h-40 md:h-44 bg-slate-100 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">


                <h4 className="mt-4 text-lg font-medium text-slate-900 leading-snug">{p.title}</h4>
                <p className="mt-3 text-sm text-slate-600 flex-1">{p.excerpt}</p>

                <div className="mt-6">
                  <Link
                    to="/insights"
                    className="inline-flex items-center gap-2 text-[#cf87bf] font-medium hover:underline"
                    aria-label={`Read ${p.title}`}
                  >
                    Read article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#3dc7f5] text-white rounded-full shadow hover:opacity-90 transition-colors duration-200"
          >
            Explore Insights
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
