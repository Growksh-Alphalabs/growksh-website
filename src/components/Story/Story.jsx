import React from 'react'
import { Link } from 'react-router-dom'
import krutika from '../../assets/Website images/Krutika photo.png'

export default function Story() {
  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-sm font-medium text-[#cf87bf] uppercase tracking-wide">MEET GROWKSH</div>

            <h2 className="text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              From <span className="text-[#cf87bf]">Guidance</span> to
              <span className="text-[#cf87bf]"> Growth</span>
            </h2>


            <p className="mt-4 text-lg text-slate-600">Founded by Krutika Kathal, a SEBI Registered Investment Adviser and Certified Financial Planner, Growksh brings together deep financial expertise and a human approach to money.</p>

            <p className="mt-4 text-lg text-slate-600">We’ve helped hundreds of professionals, families, and NRIs gain clarity, control, and calmness with their finances — proving that financial wellness is truly life wellness.</p>

         
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-full flex justify-center lg:justify-end">
              <div className="relative">
                {/* soft main-color glow behind the ring */}
                <div className="absolute -inset-6 rounded-full bg-[#3dc7f5] opacity-10 blur-3xl -z-10" />

                <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[30rem] lg:max-w-[30rem] aspect-square">
                  {/* main-color ring + shadow (solid, no gradient) */}
                  <div className="rounded-full overflow-hidden shadow-2xl w-full h-full" style={{ boxShadow: '0 0 0 8px rgba(61,199,245,0.9), 0 25px 50px rgba(0,0,0,0.12)' }}>
                    <img src={krutika} alt="Krutika Kathal" className="w-full h-full object-cover object-top" />
                  </div>
                </div>

                <div className="absolute left-6 lg:left-8 -bottom-6 bg-white rounded-2xl px-5 py-3 shadow-md border border-slate-100 flex flex-col items-start text-left max-w-xs">
                  <div className="font-semibold text-slate-900">Krutika Kathal, CFP®</div>
                  <div className="text-slate-500 text-sm">Founder & SEBI Registered Investment Adviser</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
