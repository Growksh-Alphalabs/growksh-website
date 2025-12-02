import React, { useMemo } from 'react'
import PurpleClouds from '../common/PurpleClouds'
import { COLORS } from '../../constants/colors'
import heroImg from '../../assets/1.png'

export default function Hero() {
  const bgStyle = {
    background: 'linear-gradient(180deg, #ffffff, #fbfdfb)',
  }

  return (
    <section className="relative overflow-hidden" style={bgStyle}>
      <PurpleClouds className="opacity-80" />
      {/* Add a secondary, softer cloud layer for depth */}
      <PurpleClouds className="opacity-40 transform -translate-y-8 scale-110" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50/80 ring-1 ring-emerald-100 mb-4">
                <svg className="w-3 h-3 mr-2 text-emerald-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7l3-7z" fill="#065A47" />
                </svg>
                Wealthcraft by Growksh
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
                Your Trusted <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-400">Financial Planning Partner </span> for Life!
               
              </h2>

              <p className="mt-6 text-lg text-slate-600">
                Growksh Wealthcraft helps you build <b>Financial P.E.A.C.E. of Mind</b> — with structured, unbiased, and purpose-driven financial planning designed around your life.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-150"
                  style={{ backgroundColor: COLORS.EMERALD_GREEN }}
                >
                  Get Started
                </a>

                <a
                  href="#learn"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 transition-all duration-150"
                >
                  Learn More
                </a>
              </div>

              {/* <div className="mt-8 flex items-center gap-6">
                <div>
                  <div className="text-2xl font-bold text-slate-900">5+ Cr</div>
                  <div className="text-xs text-slate-500">Wealth Advised</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">50+</div>
                  <div className="text-xs text-slate-500">Families Under Management</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-xs text-slate-500">satisfaction</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Image with Orbit */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background glows */}
              <div
                className="absolute -left-8 -top-6 w-56 h-56 rounded-full blur-3xl"
                style={{ backgroundColor: `${COLORS.EMERALD_GREEN}44`, zIndex: 0 }}
              />
              <div
                className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full blur-2xl"
                style={{ backgroundColor: `${COLORS.EMERALD_GREEN}30`, zIndex: 0 }}
              />

              {/* Main Image */}
              <img
                src={heroImg}
                alt="Creative work"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl"
                style={{
                  filter: 'drop-shadow(0 48px 100px rgba(6,103,79,0.60)) drop-shadow(0 16px 40px rgba(6,103,79,0.35))'
                }}
              />

              {/* Orbit wrapper: badges rotate around the image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                <div 
                  className="relative w-[calc(100%+120px)] h-[calc(100%+120px)]"
                  style={{ 
                    animation: 'orbit 12s linear infinite',
                    transformOrigin: 'center center',
                    willChange: 'transform'
                  }}
                >
                  {useMemo(() => {
                    const labels = ['Plan ', 'Protect ', 'Grow ', 'Live Free']
                    const angles = [0, 90, 180, 270]
                    const orbitRadius = 280 // Distance from center in pixels
                    
                    return labels.map((label, i) => {
                      const angle = angles[i % angles.length]
                      // Calculate position using trigonometry
                      const radian = (angle * Math.PI) / 180
                      const x = `calc(50% + ${orbitRadius * Math.cos(radian)}px)`
                      const y = `calc(50% + ${orbitRadius * Math.sin(radian)}px)`
                      
                      return (
                        <div
                          key={i}
                          className="absolute z-30 px-4 py-2 rounded-full text-sm text-slate-800 bg-white/95 shadow-lg backdrop-blur-sm border border-white/20"
                          style={{ 
                            top: y,
                            left: x,
                            transform: 'translate(-50%, -50%)',
                            animation: `counterOrbit 12s linear infinite`,
                            animationDelay: `${i * 0.5}s`
                          }}
                        >
                          {label}
                        </div>
                      )
                    })
                  }, [])}
                </div>
              </div>

              <style jsx>{`
                @keyframes orbit {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                @keyframes counterOrbit {
                  from {
                    transform: translate(-50%, -50%) rotate(0deg);
                  }
                  to {
                    transform: translate(-50%, -50%) rotate(-360deg);
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}