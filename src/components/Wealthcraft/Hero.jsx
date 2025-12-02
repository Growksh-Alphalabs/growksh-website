import React from 'react'
import PurpleClouds from '../common/PurpleClouds'
import { COLORS } from '../../constants/colors'
import heroImg from '../../assets/1.png'

export default function Hero() {
  const bgStyle = {
    background: 'linear-gradient(180deg, #ffffff, #fbfdfb)',
  }

  return (
    <section className="relative overflow-hidden" style={bgStyle}>
      <PurpleClouds className="opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-4xl xl:text-4xl font-bold leading-tight text-slate-900">
              Let's Work
              <br />
              <span className="block mt-2">Together to Create</span>
              <span className="block mt-2">Wonders with Us</span>
            </h1>
            
            <p className="mt-8 text-lg text-slate-600 max-w-2xl">
              A visionary creative, crafting captivating wonders through art and design. 
              Adept at turning imagination into extraordinary reality.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: COLORS.EMERALD_GREEN, color: COLORS.WHITE }}
              >
                Let's Talk
              </a>

              <a
                href="#project"
                className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg border-2 hover:bg-gray-50 transition-colors duration-300"
                style={{ borderColor: COLORS.EMERALD_GREEN, color: COLORS.EMERALD_GREEN }}
              >
                Start Project
              </a>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900">15+</div>
                <div className="text-sm text-slate-500 mt-2">years experience</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900">26K</div>
                <div className="text-sm text-slate-500 mt-2">projects success</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900">98%</div>
                <div className="text-sm text-slate-500 mt-2">satisfied rate</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <div
                className="absolute -left-8 -top-6 w-56 h-56 rounded-full blur-3xl"
                style={{ backgroundColor: `${COLORS.EMERALD_GREEN}44`, zIndex: 0 }}
              />
              <div
                className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full blur-2xl"
                style={{ backgroundColor: `${COLORS.EMERALD_GREEN}30`, zIndex: 0 }}
              />

              <img
                src={heroImg}
                alt="Creative work"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />

              {/* Image Tags */}
              <div className="absolute top-6 left-6 z-30 bg-white/95 text-sm text-slate-800 px-4 py-2 rounded-full shadow-lg">
                Illustration
              </div>
              <div className="absolute top-36 right-6 z-30 bg-white/95 text-sm text-slate-800 px-4 py-2 rounded-full shadow-lg">
                Graphic Design
              </div>
              <div className="absolute bottom-6 left-6 z-30 bg-white/95 text-sm text-slate-800 px-4 py-2 rounded-full shadow-lg">
                Creative Branding
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}