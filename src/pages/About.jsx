import React from 'react'
import CTASection from '../components/CTA/CTASection'
import krutikaImg from '../assets/Website images/Krutika photo.png'

export default function About() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <p className="text-sm font-medium text-blue-700 tracking-wide">About Us</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your partner in thoughtful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">financial growth</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine clear thinking, honest advice, and practical strategies to help you build a financial life that supports your long-term goals.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">

        {/* Our Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-xl opacity-60"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Growksh began with a simple belief: financial guidance should be clear, human, and designed around real lives. Founded to remove complexity and bring warmth to financial conversations, we focus on building long-term relationships with clients and delivering advice that's practical and personalised.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We blend evidence-based strategies with a focus on what matters most to you — not market noise. Over time, that approach builds resilience and confidence.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-sm">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-md opacity-30"></div>
                  <img 
                    src={krutikaImg} 
                    alt="Krutika Kathal" 
                    className="relative w-48 h-48 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900">Krutika Kathal</h3>
                  <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-blue-700">Founder & CEO</span>
                  </div>
                  <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                    Krutika brings deep industry knowledge and a commitment to making financial planning accessible. She believes good advice should be understandable, actionable, and aligned with your life priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-lg mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              We focus on clarity, long-term thinking, and practical steps. Our guiding principles are:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg text-center md:text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Clarity</h4>
                <p className="text-gray-600 text-sm">Explain complex ideas in plain language so you can act with confidence.</p>
              </div>

              <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg text-center md:text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Partnership</h4>
                <p className="text-gray-600 text-sm">We build long-term relationships and plan with your whole life in mind.</p>
              </div>

              <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg text-center md:text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">Practicality</h4>
                <p className="text-gray-600 text-sm">Advice that balances evidence and your personal priorities for real-world results.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Subtle gradient background elements */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-50/10 to-transparent pointer-events-none -z-10"></div>
    </div>
  )
}