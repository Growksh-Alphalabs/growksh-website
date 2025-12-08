import React from 'react'
import { Link } from 'react-router-dom';

export default function WhatWeDo() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00674F]/10 via-white to-[#00674F]/5 -z-30" />
      
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
      
      {/* Subtle green glows */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00674F]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00674F]/5 rounded-full blur-3xl" />

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

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00674F]/10 border border-[#00674F]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#00674F] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#00674F] uppercase tracking-wide">WHAT WE DO</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              We Simplify Finance,
              <span className="block">
                Without <span className="text-[#00674F]">Oversimplifying</span> Life.
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Alphalabs goes beyond textbook knowledge and market jargon. We create learning experiences that are interactive, practical, and deeply human.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="#programs" 
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                See Our Courses
                <svg 
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="#about" 
                className="inline-flex items-center px-6 py-3 border-2 border-[#ffde21] text-[#000] font-medium rounded-full hover:border-[#00674F]/50 hover:bg-[#00674F]/5 transition-all duration-300"
              >
                Learn Our Approach
              </Link>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#ffde21] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">01</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[#00674F] block" />
                  Build clarity and confidence around money decisions.
                </h3>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00674F]/0 via-[#00674F] to-[#00674F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#ffde21] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">02</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[#00674F] block" />
                  Understand how money connects to your goals, behavior, and values.
                </h3>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00674F]/0 via-[#00674F] to-[#00674F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#ffde21] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">03</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[#00674F] block" />
                  Develop real-world financial skills that last a lifetime.
                </h3>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00674F]/0 via-[#00674F] to-[#00674F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .group:hover\:-translate-y-1 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}