import React from 'react'
import { Link } from 'react-router-dom'

const rows = [
  ['A', 'Awareness', 'Start by knowing where you stand — with money, mindset, and habits.'],
  ['L', 'Learning by Doing', 'Every session is experiential — you apply concepts in real time through case studies, simulations, and exercises.'],
  ['P', 'Personal Relevance', 'The learning connects directly to your life — not theory, but your real financial situations.'],
  ['H', 'Holistic Thinking', 'We blend personal finance, behavior, and purpose — because money touches every part of life.'],
  ['A', 'Application for Alpha', 'The goal isn’t just knowledge; it’s performance — turning clarity into measurable growth.']
]

export default function AlphaApproach() {
  return (
    <section id="alpha-approach" className="relative py-16 md:py-20 overflow-hidden">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffde21]/10 via-white to-[#ffde21]/5 -z-30" />
      
      {/* Main Abstract Pattern */}
      <div className="absolute inset-0 -z-20 overflow-hidden opacity-40">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00674F" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#004D36" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#009A7B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00674F" stopOpacity="0.06" />
            </linearGradient>
            <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
            </filter>
          </defs>
          
          {/* Large Organic Shapes */}
          <g filter="url(#blur1)">
            <path
              d="M-200,400 Q200,100 600,400 Q1000,700 1400,200"
              stroke="url(#grad1)"
              strokeWidth="120"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-100,600 Q300,300 700,500 Q1100,700 1500,300"
              stroke="url(#grad2)"
              strokeWidth="100"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M0,200 Q400,0 800,300 Q1200,600 1600,100"
              stroke="url(#grad1)"
              strokeWidth="80"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>
          
          {/* Floating Circles */}
          <g>
            <circle cx="200" cy="150" r="60" fill="url(#grad1)" />
            <circle cx="1000" cy="650" r="80" fill="url(#grad2)" opacity="0.6" />
            <circle cx="800" cy="200" r="40" fill="url(#grad1)" opacity="0.4" />
            <circle cx="400" cy="600" r="50" fill="url(#grad2)" opacity="0.5" />
            <circle cx="1200" cy="300" r="70" fill="url(#grad1)" opacity="0.3" />
          </g>
          
          {/* Dots Pattern */}
          <g>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 800}
                r={Math.random() * 3 + 1}
                fill="#00674F"
                opacity={Math.random() * 0.1 + 0.05}
              />
            ))}
          </g>
        </svg>
      </div>
      
      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00674F]/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Subtle green glows */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00674F]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00674F]/5 rounded-full blur-3xl" />

      {/* Green Cloud Background */}
      <div className="absolute inset-0 -z-5 opacity-30">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="blobBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cloudGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#00674F" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#00674F" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <g filter="url(#blobBlur)">
            <path d="M80 160C120 80 240 40 360 64C480 88 620 28 740 72C860 116 980 140 1020 196C1060 252 980 332 860 344C740 356 620 316 500 320C380 324 200 360 80 320C-40 280 40 240 80 160Z" fill="url(#cloudGrad)" />
            <path d="M220 100C300 40 420 24 540 56C660 88 780 20 880 68C980 116 1040 176 990 232C940 288 820 312 700 312C580 312 420 292 300 304C180 316 140 220 220 100Z" fill="#00674F" fillOpacity="0.06" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00674F]/10 border border-[#00674F]/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#00674F] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#00674F] uppercase tracking-wide">OUR LEARNING METHODOLOGY</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            The{' '}
            <span className="relative inline-block">
              <span className="relative z-10">
                <span className="text-[#00674F]">A</span>
                <span className="text-slate-900">.</span>
                <span className="text-[#00674F]">L</span>
                <span className="text-slate-900">.</span>
                <span className="text-[#00674F]">P</span>
                <span className="text-slate-900">.</span>
                <span className="text-[#00674F]">H</span>
                <span className="text-slate-900">.</span>
                <span className="text-[#00674F]">A</span>
              </span>
              <span className="absolute inset-0 bg-[#00674F]/20 blur-xl rounded-full" />
            </span>
            {' '}Learning Model
          </h2>
          
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Every Alphalabs program follows our signature approach — built around five principles of meaningful, transformative learning.
          </p>
        </div>

        {/* ALPHA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
          {rows.map(([letter, title, desc], idx) => (
            <div 
              key={letter+idx}
              className="group relative bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl border-2 border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl"
            >
              {/* Connection Lines */}
              {idx < rows.length - 1 && (
                <>
                  {/* Mobile connection lines (vertical) */}
                  <div className="block sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-[#00674F]/60 to-transparent group-hover:from-[#00674F]" />
                  {/* Desktop connection lines (horizontal) */}
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#00674F]/60 to-transparent group-hover:from-[#00674F]" />
                </>
              )}
              
              {/* Large Letter Background */}
              <div className="absolute -top-2 -right-2 text-6xl md:text-8xl font-black text-[#ffde21]/20 group-hover:text-[#ffde21] transition-colors duration-300">
                {letter}
              </div>
              
              {/* Letter Badge */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-6">
                <div className="absolute inset-0 bg-[#00674F] rounded-xl rotate-45 transform group-hover:rotate-0 transition-transform duration-300 shadow-md" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl font-bold">{letter}</span>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 md:w-6 h-0.5 bg-[#00674F] block" />
                  <h3 className="text-base md:text-lg font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {desc}
                </p>
              </div>
              
              {/* Index Number */}
              <div className="absolute bottom-3 right-3 text-xs font-bold text-slate-300 group-hover:text-[#00674F] transition-colors">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="#programs"
            className="group inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-sm md:text-base">Join the Next Learning Experience</span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: translateY(-12px);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .animate-float,
          .group:hover\:-translate-y-2,
          .group:hover\:rotate-0,
          .group:hover\:scale-105 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}