import React from 'react'
import iconWealth from '../../assets/Website images/Wealthcraft logo1.png'
import iconVentures from '../../assets/Website images/Ventures Logo.png'
import iconAlpha from '../../assets/Website images/Alphalabs logo.png'
import img from '../../assets/Website images/Home - The Growksh Way.png'
import { Link } from 'react-router-dom'

export default function Philosophy() {
  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <div className="text-sm font-medium text-[#cf87bf] uppercase tracking-wide">The Growksh Way</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-[#2e3b4b]">We believe true wealth isn’t about numbers — it’s about P.E.A.C.E. of mind.</h2>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">Money is deeply personal. That’s why Growksh exists — to help you build wealth that aligns with your life, not just your portfolio.</p>

            <p className="mt-6 text-slate-700 max-w-xl">Through our specialized verticals, we bring together every element of financial empowerment:</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="flex flex-col gap-3 p-4 rounded-2xl border border-[#3dc7f5]/10 bg-white shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-[#3dc7f5]/10 flex items-center justify-center">
                  <img src={iconAlpha} alt="Alphalabs icon" className="w-10 h-10" />
                </div>
                <div className="text-sm font-semibold">Alphalabs</div>
                <div className="text-sm text-slate-600">Helps you understand your money.</div>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-[#cf87bf]/10 bg-white shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-[#cf87bf]/10 flex items-center justify-center">
                  <img src={iconWealth} alt="Wealthcraft icon" className="w-10 h-10" />
                </div>
                <div className="text-sm font-semibold">Wealthcraft</div>
                <div className="text-sm text-slate-600">Helps you plan your money.</div>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-[#2e3b4b]/10 bg-white shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-[#2e3b4b]/10 flex items-center justify-center">
                  <img src={iconVentures} alt="Ventures icon" className="w-10 h-10" />
                </div>
                <div className="text-sm font-semibold">Ventures</div>
                <div className="text-sm text-slate-600">Helps you grow your money.</div>
              </div>


            </div>

            {/* <div className="mt-8">
              <Link to="/about" className="inline-flex items-center px-5 py-3 bg-violet-600 text-white rounded-full font-semibold shadow hover:bg-violet-700 transition">Learn more about our approach</Link>
            </div> */}
          </div>

          {/* Right: Ecosystem graphic (three overlapping circles) */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[26rem] sm:max-w-[30rem] md:max-w-[36rem] lg:max-w-[44rem] aspect-square">
              <svg viewBox="0 0 360 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="philosophy-ecosystem-title" preserveAspectRatio="xMidYMid meet">
                <title id="philosophy-ecosystem-title">Growksh ecosystem — Learn, Plan, Grow</title>
                {/* defs removed — using solid fills for circles (no gradients) */}

                {/* Three overlapping circles */}
                <g opacity="0.95">
                  <circle cx="140" cy="120" r="110" fill="#3dc7f5" fillOpacity="0.18" />
                  <circle cx="220" cy="120" r="110" fill="#cf87bf" fillOpacity="0.14" />
                  <circle cx="180" cy="200" r="110" fill="#2e3b4b" fillOpacity="0.12" />
                </g>

                {/* Labels inside/near each circle */}
                <g fontSize="14" fontWeight="600" textAnchor="middle" fill="#2e3b4b">
                  <text x="110" y="90">Learn</text>
                  <text x="110" y="110" fontSize="11" fill="#6b7280">(Alphalabs)</text>

                  <text x="250" y="90">Plan</text>
                  <text x="250" y="110" fontSize="11" fill="#6b7280">(Wealthcraft)</text>

                  <text x="180" y="260">Grow</text>
                  <text x="180" y="280" fontSize="11" fill="#6b7280">(Ventures)</text>
                </g>

                <g>
                  {/* Larger emblem: circle radius 40 (diameter 80) */}
                  <circle cx="180" cy="150" r="40" fill="#ffffff" fillOpacity="0.95" stroke="#3dc7f5" strokeOpacity="0.6" strokeWidth="1" />
                  {/* Place the raster emblem centered in the circle (diameter = 80) */}
                  <image
                    href={img}
                    x={140}
                    y={110}
                    width={80}
                    height={80}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Plant emblem"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
