import React from 'react'
import { COLORS } from '../../constants/colors'
import heroImg from '../../assets/Website images/Wealthcraft - hero section.png'
import wealthcraftLogo from '../../assets/Website images/Wealthcraft logo.png'
import { Link } from 'react-router-dom'

export default function Hero() {
  const bgStyle = {
    backgroundImage: `url(${heroImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '80vh',
  }
  return (
    <section className="relative overflow-hidden w-full" style={bgStyle}>
      {/* Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/45 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            {/* Blurred translucent panel behind text for legibility */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 max-w-xl">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-black bg-yellow-400/95 ring-1 ring-yellow-400/50 mb-4">
                <img src={wealthcraftLogo} alt="Wealthcraft" className="w-7 h-7 mr-3 object-contain" />
                <span className="leading-none">Wealthcraft by Growksh</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                Your Trusted <span className="text-[#ffde21]">Financial Partner</span> for Life!
              </h2>

              <p className="mt-6 text-lg text-white/90">
                Growksh Wealthcraft helps you build <b>Financial P.E.A.C.E. of Mind</b> — with structured, unbiased, and purpose-driven financial planning designed around your life.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-150"
                  style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                >
                  Book a Discovery Call
                </Link>

                <Link
                  to="#learn"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-150"
                >
                  Know How It Works
                </Link>
              </div>
            </div>
          </div>

          {/* Right column intentionally left empty — hero image is used as full-bleed background */}
          <div className="lg:w-1/2" aria-hidden />
        </div>
      </div>
    </section>
  )
}