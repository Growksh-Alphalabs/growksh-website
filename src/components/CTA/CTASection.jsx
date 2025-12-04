import React from 'react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Purple smoke background (decorative) */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-95" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="p1" cx="20%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="p2" cx="80%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
            <filter id="blurMe" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
            </filter>
          </defs>

          <g filter="url(#blurMe)">
            <ellipse cx="220" cy="120" rx="380" ry="200" fill="url(#p1)" />
            <ellipse cx="1200" cy="160" rx="360" ry="220" fill="url(#p2)" />
            <ellipse cx="760" cy="340" rx="260" ry="140" fill="#8b5cf6" fillOpacity="0.14" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Ready to Start Your Journey?</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Whether you want to plan better, learn better, or grow better — Growksh has a path for you.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-slate-800">Want to Learn Finance?</div>
                <div className="mt-1 text-sm text-slate-600">Join structured courses and workshops to build practical skills.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/alphalabs"
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 text-violet-700 rounded-lg font-medium shadow hover:scale-[1.02] transition-transform duration-200"
                aria-label="Join a Course"
              >
                <span>Join a Course</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-slate-800">Need Personal Advice?</div>
                <div className="mt-1 text-sm text-slate-600">Talk with an advisor to align your plan with life goals.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/ventures"
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 text-violet-700 rounded-lg font-medium shadow hover:scale-[1.02] transition-transform duration-200"
                aria-label="Discover Ventures"
              >
                <span>Talk to an Advisor</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-slate-800">Looking for Execution Support?</div>
                <div className="mt-1 text-sm text-slate-600">Explore our execution arm for managed investments and implementation.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/ventures"
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 text-violet-700 rounded-lg font-medium shadow hover:scale-[1.02] transition-transform duration-200"
                aria-label="Discover Ventures"
              >
                <span>Discover Ventures</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>



        </div>
      </div>
    </section>
  )
}
