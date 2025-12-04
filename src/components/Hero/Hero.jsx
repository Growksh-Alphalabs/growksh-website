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
    <section className="py-20 bg-gradient-to-br from-purple-50 to-white text-slate-500 relative overflow-hidden">
      {/* Modern abstract purple background */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full -z-10" viewBox="0 0 1440 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbf8ff" stopOpacity="1" />
            <stop offset="50%" stopColor="#f7f3ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbf8ff" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="softBloom1" cx="85%" cy="15%" r="65%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#c4b5fd" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f7f3ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="softBloom2" cx="15%" cy="75%" r="55%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#f7f3ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="softBloom3" cx="60%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
            <stop offset="80%" stopColor="#d8b4fe" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#f7f3ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="softBloom4" cx="75%" cy="60%" r="45%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#b794f4" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#f7f3ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="softBloom5" cx="40%" cy="25%" r="40%">
            <stop offset="0%" stopColor="#9f7aea" stopOpacity="0.07" />
            <stop offset="60%" stopColor="#e9d5ff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <filter id="gentleBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="35" />
          </filter>

          <filter id="lightBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* Base gradient */}
        <rect width="100%" height="100%" fill="url(#purpleGradient)" />

        {/* Soft blooms */}
        <ellipse cx="85%" cy="15%" rx="380" ry="280" fill="url(#softBloom1)" filter="url(#gentleBlur)" opacity="0.95" />
        <ellipse cx="15%" cy="80%" rx="320" ry="220" fill="url(#softBloom2)" filter="url(#gentleBlur)" opacity="0.85" />
        <circle cx="55%" cy="40%" r="260" fill="url(#softBloom3)" filter="url(#gentleBlur)" opacity="0.75" />
        {/* Additional blooms for denser abstract clouds */}
        <ellipse cx="75%" cy="60%" rx="300" ry="220" fill="url(#softBloom4)" filter="url(#gentleBlur)" opacity="0.6" />
        <ellipse cx="40%" cy="25%" rx="220" ry="180" fill="url(#softBloom5)" filter="url(#gentleBlur)" opacity="0.55" />
        <circle cx="920" cy="520" r="120" fill="url(#softBloom4)" filter="url(#lightBlur)" opacity="0.32" />

        {/* Geometric forms */}
        <g opacity="0.08">
          <polygon points="1250,120 1350,100 1380,200 1280,220" fill="#8b5cf6" filter="url(#lightBlur)" />
          <polygon points="120,480 250,440 280,600 150,640" fill="#7c3aed" filter="url(#lightBlur)" />
          <polygon points="450,80 550,60 580,160 480,180" fill="#a855f7" filter="url(#lightBlur)" />
        </g>

        {/* Floating elements */}
        <g opacity="0.06">
          <circle cx="250" cy="180" r="60" fill="#8b5cf6" filter="url(#lightBlur)" />
          <circle cx="1200" cy="420" r="45" fill="#7c3aed" filter="url(#lightBlur)" />
          <circle cx="850" cy="580" r="75" fill="#a855f7" filter="url(#lightBlur)" />
          <circle cx="550" cy="320" r="55" fill="#8b5cf6" filter="url(#lightBlur)" />
          <circle cx="980" cy="260" r="48" fill="#9f7aea" filter="url(#lightBlur)" />
          <circle cx="700" cy="120" r="36" fill="#7c3aed" filter="url(#lightBlur)" />
          <ellipse cx="300" cy="520" rx="44" ry="28" fill="#a855f7" filter="url(#lightBlur)" />
        </g>

        {/* Minimal shapes */}
        <g opacity="0.05">
          <rect x="1150" y="540" width="35" height="35" rx="7" fill="#a855f7" filter="url(#lightBlur)" />
          <rect x="350" y="220" width="28" height="28" rx="6" fill="#8b5cf6" filter="url(#lightBlur)" />
          <rect x="1280" y="320" width="22" height="22" rx="5" fill="#7c3aed" filter="url(#lightBlur)" />
        </g>

        {/* Subtle lines */}
        <g opacity="0.04">
          <path d="M0,0 L1440,800" stroke="#7c3aed" strokeWidth="25" />
          <path d="M1440,0 L0,800" stroke="#8b5cf6" strokeWidth="20" />
        </g>

        {/* Dots pattern */}
        <g opacity="0.03">
          <circle cx="180" cy="300" r="4" fill="#7c3aed" />
          <circle cx="1300" cy="150" r="3" fill="#8b5cf6" />
          <circle cx="600" cy="550" r="5" fill="#a855f7" />
          <circle cx="950" cy="250" r="3.5" fill="#7c3aed" />
          <circle cx="300" cy="650" r="4" fill="#8b5cf6" />
          <circle cx="1100" cy="400" r="3" fill="#a855f7" />
        </g>
      </svg>

      {/* Subtle static elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-20 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-fuchsia-300/8 rounded-full blur-2xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-300/12 rounded-full blur-4xl" />
        <div className="absolute left-20 top-1/3 w-44 h-44 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-8 left-1/2 w-60 h-60 bg-fuchsia-400/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-slate-700 border border-white/60 shadow-sm">
                <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">Upcoming!</span>
                <span className="text-sm font-medium">Explore Wealth Management</span>
                <svg className="w-4 h-4 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif" }}>
              <span className="block">
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Crafting Wealth.</span>
              </span>

              <span className="block mt-1 text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-semibold">Creating Confidence.</span>
            </h1>

            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
              At Growksh, we help you take charge of your money — through education, planning, and purposeful action.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/alphalabs"
                className="inline-flex items-center px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-semibold shadow-sm transition-all duration-150"
                aria-label="Explore Education"
              >
                Explore Education
              </Link>

              <Link
                to="/wealthcraft"
                className="inline-flex items-center px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-sm transition-all duration-150"
                aria-label="Explore Advisory"
              >
                Explore Advisory
              </Link>
            </div>
          </div>

          {/* Right: Enhanced circular flow visual */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-2xl">
              {/* Animated circular flow */}
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Outer circular path */}
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    </linearGradient>
                    
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
                  <g fill="none" stroke="url(#circularGradient)" strokeWidth="2" strokeLinecap="round">
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
                    <circle cx="350" cy="200" r="5" fill="#7c3aed" filter="url(#glow)" opacity="0.8">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                  
                  {/* Dot 2 - Wealthcraft */}
                  <g className="animate-[orbit_8s_linear_infinite] origin-center" style={{animationDelay: '-2.7s'}}>
                    <circle cx="200" cy="50" r="5" fill="#a855f7" filter="url(#glow)" opacity="0.8">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                  
                  {/* Dot 3 - Ventures */}
                  <g className="animate-[orbit_8s_linear_infinite] origin-center" style={{animationDelay: '-5.3s'}}>
                    <circle cx="50" cy="200" r="5" fill="#8b5cf6" filter="url(#glow)" opacity="0.8">
                      <animateMotion
                        path="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                  
                  {/* Labels */}
                  <g fontSize="14" fontWeight="500" textAnchor="middle" fill="#4c1d95">
                    {/* Alphalabs label - moves along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#7c3aed">Alphalabs</tspan>
                      <animateMotion dur="8s" repeatCount="indefinite" begin="0s" rotate="0">
                        <mpath xlinkHref="#mainOrbit" />
                      </animateMotion>
                    </text>

                    {/* Wealthcraft label - offset along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#a855f7">Wealthcraft</tspan>
                      <animateMotion dur="8s" repeatCount="indefinite" begin="2.666s" rotate="0">
                        <mpath xlinkHref="#mainOrbit" />
                      </animateMotion>
                    </text>

                    {/* Ventures label - offset along orbit */}
                    <text className="font-semibold">
                      <tspan fill="#8b5cf6">Ventures</tspan>
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
                    <text fontSize="12" fill="#5b21b6" fontWeight="600" textAnchor="middle">
                      <tspan>Learn</tspan>
                      <animateMotion dur="6s" repeatCount="indefinite" begin="0s" rotate="0">
                        <mpath xlinkHref="#innerOrbit" />
                      </animateMotion>
                    </text>

                    <text fontSize="12" fill="#5b21b6" fontWeight="600" textAnchor="middle">
                      <tspan>Plan</tspan>
                      <animateMotion dur="6s" repeatCount="indefinite" begin="2s" rotate="0">
                        <mpath xlinkHref="#innerOrbit" />
                      </animateMotion>
                    </text>

                    <text fontSize="12" fill="#5b21b6" fontWeight="600" textAnchor="middle">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                    
                    {/* Center circle with hero PNG */}
                    <div className="bg-white/95 backdrop-blur-sm border border-white/80 rounded-full w-36 h-36 flex items-center justify-center shadow-2xl shadow-purple-100/50 relative z-10">
                      <img
                        src={homeHeroImg}
                        alt="Growksh center"
                        className="w-32 h-32 rounded-full object-cover shadow-inner"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Background blur effects */}
                <div className="absolute -right-12 -bottom-8 w-60 h-60 rounded-full bg-gradient-to-br from-violet-400/10 to-purple-400/10 blur-3xl" />
                <div className="absolute -left-12 -top-8 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-300/8 to-pink-300/8 blur-3xl" />
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