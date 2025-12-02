import React from 'react'
import krutika from '../../assets/krutika.jpg'

export default function Story() {
  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-sm font-medium text-violet-600 uppercase tracking-wide">MEET GROWKSH</div>

            <h2 className="text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              From <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Guidance</span> to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"> Growth</span>
            </h2>


            <p className="mt-4 text-lg text-slate-600">Founded by Krutika Kathal, a SEBI Registered Investment Adviser and Certified Financial Planner, Growksh brings together deep financial expertise and a human approach to money.</p>

            <p className="mt-4 text-lg text-slate-600">We’ve helped hundreds of professionals, families, and NRIs gain clarity, control, and calmness with their finances — proving that financial wellness is truly life wellness.</p>

            <div className="mt-6">
              <a href="/about" className="inline-flex items-center px-5 py-3 bg-violet-600 text-white rounded-full font-semibold shadow-sm hover:bg-violet-700 transition">Learn more about Krutika</a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-full rounded-xl overflow-visible shadow-lg bg-slate-50 relative">
              <img src={krutika} alt="Krutika Kathal" className="w-full h-80 lg:h-96 object-cover rounded-xl" />

              <div className="absolute left-6 lg:left-8 bottom-6 bg-white rounded-2xl px-5 py-3 shadow-md border border-slate-100 flex flex-col items-start text-left max-w-xs">
                <div className="font-semibold text-slate-900">Krutika Kathal, CFP®</div>
                <div className="text-slate-500 text-sm">Founder & SEBI Registered Investment Adviser</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
