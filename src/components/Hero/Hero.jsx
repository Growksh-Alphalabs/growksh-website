import React, { useState, useEffect, useMemo } from 'react'
import homeHeroImg from '../../assets/Website images/Home - hero section.png'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const words = useMemo(
    () => ["education", "planning", "purposeful action"],
    []
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) =>
        prevIndex === words.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(intervalId);
  }, [words.length]);

  return (
    <section className="min-h-screen md:min-h-0 py-8 sm:py-12 md:py-16 lg:pt-20 bg-white text-slate-500 relative overflow-visible md:overflow-hidden">
      {/* Modern abstract purple background */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full -z-10" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          {/* Solid-color blooms used instead of SVG gradients */}

          <filter id="gentleBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="35" />
          </filter>

          <filter id="lightBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* Base fill (solid) */}
        <rect width="100%" height="100%" fill="#ffffff" />

        {/* Soft blooms */}
        <ellipse cx="85%" cy="15%" rx="380" ry="280" fill="#3dc7f5" filter="url(#gentleBlur)" opacity="0.18" />
        <ellipse cx="15%" cy="80%" rx="320" ry="220" fill="#3dc7f5" filter="url(#gentleBlur)" opacity="0.12" />
        <circle cx="55%" cy="40%" r="260" fill="#cf87bf" filter="url(#gentleBlur)" opacity="0.12" />
        {/* Additional blooms for denser abstract clouds */}
        <ellipse cx="75%" cy="60%" rx="300" ry="220" fill="#3dc7f5" filter="url(#gentleBlur)" opacity="0.08" />
        <ellipse cx="40%" cy="25%" rx="220" ry="180" fill="#cf87bf" filter="url(#gentleBlur)" opacity="0.06" />
        <circle cx="920" cy="520" r="120" fill="#3dc7f5" filter="url(#lightBlur)" opacity="0.06" />

        {/* Geometric forms */}
        <g opacity="0.06">
          <polygon points="1250,120 1350,100 1380,200 1280,220" fill="#3dc7f5" filter="url(#lightBlur)" />
          <polygon points="120,480 250,440 280,600 150,640" fill="#3dc7f5" filter="url(#lightBlur)" />
          <polygon points="450,80 550,60 580,160 480,180" fill="#cf87bf" filter="url(#lightBlur)" />
        </g>

        {/* Floating elements */}
        <g opacity="0.05">
          <circle cx="250" cy="180" r="60" fill="#3dc7f5" filter="url(#lightBlur)" />
          <circle cx="1200" cy="420" r="45" fill="#3dc7f5" filter="url(#lightBlur)" />
          <circle cx="850" cy="580" r="75" fill="#cf87bf" filter="url(#lightBlur)" />
          <circle cx="550" cy="320" r="55" fill="#3dc7f5" filter="url(#lightBlur)" />
          <circle cx="980" cy="260" r="48" fill="#cf87bf" filter="url(#lightBlur)" />
          <circle cx="700" cy="120" r="36" fill="#3dc7f5" filter="url(#lightBlur)" />
          <ellipse cx="300" cy="520" rx="44" ry="28" fill="#cf87bf" filter="url(#lightBlur)" />
        </g>

        {/* Minimal shapes */}
        <g opacity="0.04">
          <rect x="1150" y="540" width="35" height="35" rx="7" fill="#cf87bf" filter="url(#lightBlur)" />
          <rect x="350" y="220" width="28" height="28" rx="6" fill="#3dc7f5" filter="url(#lightBlur)" />
          <rect x="1280" y="320" width="22" height="22" rx="5" fill="#3dc7f5" filter="url(#lightBlur)" />
        </g>

        {/* Subtle lines */}
        <g opacity="0.03">
          <path d="M0,0 L1440,800" stroke="#3dc7f5" strokeWidth="18" />
          <path d="M1440,0 L0,800" stroke="#cf87bf" strokeWidth="14" />
        </g>

        {/* Dots pattern */}
        <g opacity="0.02">
          <circle cx="180" cy="300" r="4" fill="#3dc7f5" />
          <circle cx="1300" cy="150" r="3" fill="#3dc7f5" />
          <circle cx="600" cy="550" r="5" fill="#cf87bf" />
          <circle cx="950" cy="250" r="3.5" fill="#3dc7f5" />
          <circle cx="300" cy="650" r="4" fill="#3dc7f5" />
          <circle cx="1100" cy="400" r="3" fill="#cf87bf" />
        </g>
      </svg>

      {/* Subtle static elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#3dc7f5]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-20 w-96 h-96 bg-[#cf87bf]/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-[#cf87bf]/8 rounded-full blur-2xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#3dc7f5]/12 rounded-full blur-4xl" />
        <div className="absolute left-20 top-1/3 w-44 h-44 bg-[#3dc7f5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-8 left-1/2 w-60 h-60 bg-[#cf87bf]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 lg:gap-8">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 order-1 lg:order-1 mt-4 lg:mt-0 lg:ml-16">
          {/* <Link to="/ventures" className="inline-block mb-6">
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-slate-700 border border-white/60 shadow-sm">
                <span className="bg-[#cf87bf] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm">Upcoming!</span>
                <span className="text-xs sm:text-sm font-medium">Explore Asset Management</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#2e3b4b] ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </Link> */}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif" }}>
              <span className="block">
                <span className="text-[#3dc7f5]">CRAFTING WEALTH.</span>
              </span>

              <span className="block mt-1 sm:mt-1 text-slate-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">CREATING CONFIDENCE.</span>
            </h1>

            <p className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl">
              At Growksh, we help you take charge of your money — through education, planning, and purposeful action.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/alphalabs"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#00674F] hover:bg-[#00674F]/90 text-white rounded-full font-semibold text-base sm:text-lg shadow-sm transition-all duration-150"
                aria-label="Explore Education"
              >
                Explore Education
              </Link>

              <Link
                to="/wealthcraft"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#ffde21] hover:bg-[#ffde21]/90 text-black rounded-full font-semibold text-base sm:text-lg shadow-sm transition-all duration-150"
                aria-label="Explore Advisory"
              >
                Explore Advisory
              </Link>

                <Link
                to="/ventures"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5  bg-gray-800 hover:bg-gray-800/90 text-white rounded-full font-semibold text-base sm:text-lg shadow-sm transition-all duration-150"
                aria-label="Explore Asset Management"
              >
                Explore Asset Management
              </Link>
            </div>
          </div>

          {/* Right: Enhanced circular flow visual */}
          <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              {/* Animated circular flow */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                {/* Outer circular path */}
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    {/* circularGradient removed; using solid stroke color instead */}

                    {/* Glow effect for animated dots */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Circular paths */}
                  <g fill="none" stroke="#3dc7f5" strokeWidth="2" strokeLinecap="round">
                      {/* Main circular path */}
                      <path id="mainOrbit" d="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        strokeOpacity="0.15" strokeDasharray="2,3" />

                      {/* Inner path */}
                      <path id="innerOrbit" d="M200,100 A100,100 0 1,1 200,300 A100,100 0 1,1 200,100"
                        strokeOpacity="0.1" strokeDasharray="1,2" />
                  </g>

                  {/* Animated dots moving along paths */}
                  {/* Dot 1 - Alphalabs */}
                    <g className="animate-[orbit_8s_linear_infinite]">
                    <circle cx="350" cy="200" r="5" fill="#3dc7f5" filter="url(#glow)" opacity="0.9">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Dot 2 - Wealthcraft */}
                    <g className="animate-[orbit_8s_linear_infinite] origin-center" style={{animationDelay: '-2.7s'}}>
                    <circle cx="200" cy="50" r="5" fill="#cf87bf" filter="url(#glow)" opacity="0.85">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Dot 3 - Ventures */}
                    <g className="animate-[orbit_8s_linear_infinite] origin-center" style={{animationDelay: '-5.3s'}}>
                    <circle cx="50" cy="200" r="5" fill="#3dc7f5" filter="url(#glow)" opacity="0.8">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Labels */}
                  <g fontSize="12" fontWeight="500" textAnchor="middle" fill="#2e3b4b">
                    {/* Alphalabs label - moves along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#3dc7f5">Alphalabs</tspan>
                      <animateMotion dur="8s" repeatCount="indefinite" begin="0s" rotate="0">
                        <mpath xlinkHref="#mainOrbit" />
                      </animateMotion>
                    </text>

                    {/* Wealthcraft label - offset along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#cf87bf">Wealthcraft</tspan>
                      <animateMotion dur="8s" repeatCount="indefinite" begin="2.666s" rotate="0">
                        <mpath xlinkHref="#mainOrbit" />
                      </animateMotion>
                    </text>

                    {/* Ventures label - offset along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#2e3b4b">Ventures</tspan>
                      <animateMotion dur="8s" repeatCount="indefinite" begin="5.333s" rotate="0">
                        <mpath xlinkHref="#mainOrbit" />
                      </animateMotion>
                    </text>
                  </g>

                  {/* Connection arrows */}
                  <g fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" opacity="0.4">
                    <path d="M350,200 A150,150 0 0,0 200,50" />
                    <path d="M200,50 A150,150 0 0,0 50,200" />
                    <path d="M50,200 A150,150 0 0,0 350,200" />
                  </g>

                  {/* Rotating center label along the inner orbit */}
                  <g>
                    <text fontSize="10" fill="#2e3b4b" fontWeight="600" textAnchor="middle">
                      <tspan>Learn</tspan>
                      <animateMotion dur="6s" repeatCount="indefinite" begin="0s" rotate="0">
                        <mpath xlinkHref="#innerOrbit" />
                      </animateMotion>
                    </text>

                    <text fontSize="10" fill="#2e3b4b" fontWeight="600" textAnchor="middle">
                      <tspan>Plan</tspan>
                      <animateMotion dur="6s" repeatCount="indefinite" begin="2s" rotate="0">
                        <mpath xlinkHref="#innerOrbit" />
                      </animateMotion>
                    </text>

                    <text fontSize="10" fill="#2e3b4b" fontWeight="600" textAnchor="middle">
                      <tspan>Grow</tspan>
                      <animateMotion dur="6s" repeatCount="indefinite" begin="4s" rotate="0">
                        <mpath xlinkHref="#innerOrbit" />
                      </animateMotion>
                    </text>
                  </g>
                </svg>

                {/* Center badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Pulsing glow effect */}
                    <div className="absolute inset-0 bg-[#3dc7f5]/20 rounded-full blur-xl animate-pulse"></div>

                    {/* Center circle with hero PNG */}
                    <div className="bg-white/95 backdrop-blur-sm border border-white/80 rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center shadow-2xl relative z-10">
                      <img
                        src={homeHeroImg}
                        alt="Growksh center"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Background blur effects */}
                <div className="absolute -right-6 sm:-right-8 md:-right-12 -bottom-4 sm:-bottom-6 md:-bottom-8 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full bg-[#3dc7f5]/10 blur-3xl" />
                <div className="absolute -left-6 sm:-left-8 md:-left-12 -top-4 sm:-top-6 md:-top-8 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full bg-[#cf87bf]/8 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations for orbit */}
      <style>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(150px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(150px) rotate(-360deg);
          }
        }
      `}</style>
    </section>
  )
}
