import React from 'react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0b2545] text-white">
      {/* Purple smoke background (decorative) */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-95" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Solid soft shapes using the theme colors (no gradients) */}
          <rect width="100%" height="100%" fill="#0b2545" />
          <g opacity="0.36">
            <ellipse cx="220" cy="120" rx="380" ry="200" fill="#3dc7f5" fillOpacity="0.08" />
            <ellipse cx="1200" cy="160" rx="360" ry="220" fill="#cf87bf" fillOpacity="0.06" />
            <ellipse cx="760" cy="340" rx="260" ry="140" fill="#2e3b4b" fillOpacity="0.04" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
            <span className="text-[#cf87bf]">Ready to Start Your Journey?</span>
          </h2>
          <p className="mt-3 text-slate-200 max-w-2xl mx-auto">Whether you want to plan better, learn better, or grow better — Growksh has a path for you.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="group relative bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-white">Want to Learn Finance?</div>
                <div className="mt-1 text-sm text-slate-200">Join structured courses and workshops to build practical skills.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/alphalabs"
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#3dc7f5] text-white rounded-lg font-medium shadow hover:opacity-90 transition-transform duration-200"
                aria-label="Join a Course"
              >
                <span>Join a Course</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-white">Need Personal Advice?</div>
                <div className="mt-1 text-sm text-slate-200">Talk with an advisor to align your plan with life goals.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/wealthcraft"
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#3dc7f5] text-white rounded-lg font-medium shadow hover:opacity-90 transition-transform duration-200"
                aria-label="Discover Ventures"
              >
                <span>Talk to an Advisor</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-sm font-semibold text-white">Looking for Execution Support?</div>
                <div className="mt-1 text-sm text-slate-200">Explore our execution arm for managed investments and implementation.</div>
              </div>

            </div>

            <div className="mt-6 flex items-end justify-between">
              <Link
                to="/ventures"
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#3dc7f5] text-white rounded-lg font-medium shadow hover:opacity-90 transition-transform duration-200"
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
