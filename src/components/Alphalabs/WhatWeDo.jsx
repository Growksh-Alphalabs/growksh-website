import React from 'react'

export default function WhatWeDo() {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ffde21 1px, transparent 1px),
                          linear-gradient(to bottom, #ffde21 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-yellow-300">WHAT WE DO</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We Simplify Finance,
              <span className="block">
                Without <span className="text-yellow-400">Oversimplifying</span> Life.
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Alphalabs goes beyond textbook knowledge and market jargon. We create learning experiences that are interactive, practical, and deeply human.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="#programs" 
                className="group inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
              </a>
              <a 
                href="#about" 
                className="inline-flex items-center px-6 py-3 border-2 border-yellow-400/30 text-yellow-300 font-medium rounded-full hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300"
              >
                Learn Our Approach
              </a>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.02]">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">01</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-yellow-400 block" />
                  Build clarity and confidence around money decisions.
                </h3>
                
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.02]">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">02</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-yellow-400 block" />
                  Understand how money connects to your goals, behavior, and values.
                </h3>
               
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.02]">
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">03</span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-yellow-400 block" />
                  Develop real-world financial skills that last a lifetime.
                </h3>
              
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          .group:hover\:scale-\[1\.02\] {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}