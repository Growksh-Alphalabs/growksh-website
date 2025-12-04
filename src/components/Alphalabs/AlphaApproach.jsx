import React from 'react'
import { Link } from 'react-router-dom'

const rows = [
  ['A', 'Awareness', 'Start by knowing where you stand — with money, mindset, and habits.'],
  ['L', 'Learning by Doing', 'Every session is experiential — apply concepts through simulations and exercises.'],
  ['P', 'Personal Relevance', 'Learning connects directly to your life — not abstract theory.'],
  ['H', 'Holistic Thinking', 'We blend personal finance, behavior, and purpose together.'],
  ['A', 'Application for Alpha', 'Turn clarity into measurable growth and better decisions.']
]

export default function AlphaApproach() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-yellow-100 via-transparent to-transparent" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-yellow-700">OUR  LEARNING  METHODOLOGY</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            The{' '}
            <span className="relative inline-block">
              <span className="relative z-10">
                <span className="text-yellow-500">A</span>
                <span className="text-black">.</span>
                <span className="text-yellow-500">L</span>
                <span className="text-black">.</span>
                <span className="text-yellow-500">P</span>
                <span className="text-black">.</span>
                <span className="text-yellow-500">H</span>
                <span className="text-black">.</span>
                <span className="text-yellow-500">A</span>
              </span>
              <span className="absolute inset-0 bg-yellow-200/40 blur-xl rounded-full" />
            </span>
            {' '}Learning Model
          </h2>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Every Alphalabs program follows our signature approach — built around five principles of meaningful, transformative learning.
          </p>
        </div>

        {/* ALPHA Cards */}
        <div className="grid lg:grid-cols-5 gap-6 mb-16">
          {rows.map(([letter, title, desc], idx) => (
            <div 
              key={letter+idx}
              className="group relative bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-lg"
            >
              {/* Connection Lines */}
              {idx < rows.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-yellow-400/60 to-transparent group-hover:from-yellow-400" />
              )}
              
              {/* Large Letter Background */}
              <div className="absolute -top-4 -right-4 text-8xl font-black text-yellow-100/70 group-hover:text-yellow-100 transition-colors duration-300">
                {letter}
              </div>
              
              {/* Letter Badge */}
              <div className="relative w-14 h-14 mb-6">
                <div className="absolute inset-0 bg-yellow-400 rounded-xl rotate-45 transform group-hover:rotate-0 transition-transform duration-300 shadow-md" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{letter}</span>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-0.5 bg-yellow-400 block" />
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
              
              {/* Index Number */}
              <div className="absolute bottom-4 right-4 text-xs font-bold text-gray-300 group-hover:text-yellow-400 transition-colors">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>


      

        {/* CTA */}
        <div className="text-center">
          <Link to="#programs"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>Join the Next Learning Experience</span>
            <svg 
              className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" 
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
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .group:hover\:-translate-y-2,
          .group:hover\:rotate-0,
          .group:hover\:scale-110 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}