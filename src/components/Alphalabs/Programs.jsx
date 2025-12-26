import React from 'react'
import { Link } from 'react-router-dom'

export default function Programs() {
  const comingSoonPrograms = [
    { name: 'The Financial Foundations Lab', audience: 'Working professionals & young earners', focus: 'Personal finance fundamentals', status: 'Coming Soon' },
    { name: 'The Financial Planning Accelerator', audience: 'Finance students & aspiring planners', focus: 'Applied financial planning skills', status: 'Coming Soon' },
    { name: 'CFA / CA Enrichment Tracks', audience: 'Finance aspirants & professionals', focus: 'Real-world case application', status: 'Coming Soon' },
    { name: 'The Alpha Life Series', audience: 'Anyone interested in growth', focus: 'Finance, health & purpose connection', status: 'Coming Soon' }
  ]

  return (
    <section id="programs" className="relative py-16 md:py-20 overflow-hidden">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00674F]/10 via-white to-[#00674F]/5 -z-30" />

      {/* Main Abstract Pattern */}
      <div className="absolute inset-0 -z-20 overflow-hidden opacity-30">
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
            className="absolute w-1 h-1 bg-[#00674F]/15 rounded-full animate-float"
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
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            <span className="relative inline-block">
              <span className="relative z-10">OUR LEARNING EXPERIENCES</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#00674F]/20 -z-10" />
            </span>
          </h2>

          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Each program at Alphalabs is designed to meet learners where they are — from foundational money skills to advanced financial understanding.
          </p>
        </div>

        {/* Flagship Program */}
        <div className="relative mb-16 md:mb-20">
          {/* Badge */}
          <div className="absolute -top-4 left-4 z-20">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ffde21] rounded-full shadow-lg">
              <span className="text-lg">💎</span>
              <span className="text-sm font-bold text-black">FLAGSHIP PROGRAM</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-[#00674F]/20 p-6 md:p-12 overflow-hidden shadow-xl">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00674F]/5 rounded-full -translate-y-32 translate-x-32" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                    F³ <span className="text-[#00674F]">(Financial Fitness for Females)</span>
                  </h3>
                  <p className="text-lg text-[#00674F]/80 font-medium mb-4">
                    Making women Financially Aware • Financially Able • Financially Assured
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    F³ is a three-level journey that helps women move from confusion to confidence with their finances.
                    It combines structured coaching, real-life examples, and actionable tools that make money management
                    simple, practical, and empowering.
                  </p>
                </div>
                <div className="lg:w-48">
                  <div className="bg-[#00674F]/10 border border-[#00674F]/20 rounded-2xl p-4">
                    <div className="text-[#00674F] text-sm font-bold mb-2">PERFECT FOR</div>
                    <ul className="text-slate-700 text-sm space-y-1">
                      <li>• Beginners to finance</li>
                      <li>• Working professionals</li>
                      <li>• Life-stage transitions</li>
                      <li>• Confidence building</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Levels Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {/* Level 1 */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#00674F] to-[#005e48] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <div className="pt-4 flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">The Awareness Bootcamp</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffde21]/10 border border-[#ffde21]/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-[#00674F]">Build clarity • Break confusion</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      Become financially aware and lay a strong foundation for long-term financial well-being by learning 6 pillars of financial planning in a simplified, structured, and relatable manner.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-slate-600">Women who want to understand their money before managing it.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-slate-600">Pre-recorded videos + Q&A session + practical worksheets + real-life case studies</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to="#"
                      className="block w-full text-center py-3 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      Enroll in Level 1
                    </Link>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#00674F] to-[#005e48] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">02</span>
                  </div>
                  <div className="pt-4 flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">The Ability Accelerator</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffde21]/10 border border-[#ffde21]/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-[#00674F]">From knowing to doing</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      Design a working money system — from saving and investing, to insurance, and building your financial base step by step.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-slate-600">Women ready to take control of their financial life actively.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-slate-600">Detailed coaching videos, tools, templates, calculators and live group sessions</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to="#"
                      className="block w-full text-center py-3 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      Join Level 2
                    </Link>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-[#00674F] to-[#005e48] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">03</span>
                  </div>
                  <div className="pt-4 flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">The Assurance Advantage</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffde21]/10 border border-[#ffde21]/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-[#00674F]">Expert care for your money</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      A personalized, one-on-one financial consultation & portfolio oversight for women who want peace of mind, not more to-do lists.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-slate-600">Women who prefer a professional to manage their finances end-to-end.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-[#00674F] font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-slate-600">One-on-one financial consultation and implementation via Growksh Wealthcraft</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to="#"
                      className="block w-full text-center py-3 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      Apply for Level 3
                    </Link>
                  </div>
                </div>
              </div>

              {/* Why Women Love F³ */}
              <div className="bg-[#ffde21]/5 border border-[#ffde21]/10 rounded-2xl p-6 mb-8">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#00674F]">✨</span>
                  Why Women Love F³
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    'Step-by-step structure — no jargon, no overwhelm',
                    'Designed by a woman, for women',
                    'Builds financial confidence',
                    'Lifetime access to materials',
                    'Optional upgrade to consultation'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-[#00674F]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-[#00674F] rounded-full" />
                      </div>
                      <span className="text-sm text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main CTA */}
              <div className="text-center">
                <Link
                  to="#"
                  aria-label="Join The Awareness Bootcamp Today"
                  className="group inline-flex items-center justify-center gap-3 relative bg-[#ffde21] backdrop-blur-sm p-6 rounded-2xl border border-[#ffde21]/10 hover:border-[#ffde21]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <span>Join F³ (Financial Fitness for Females)</span>
                  <svg
                    className="w-5 h-5 transition-transform transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Programs */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              <span className="relative inline-block">
                <span className="relative z-10">Coming Soon: More Learning Programs</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#00674F]/20 -z-10" />
              </span>
            </h3>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              We're continuously expanding our Alphalabs ecosystem to include new experiential programs across professions, life stages, and learning goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonPrograms.map((program, idx) => (
              <div
                key={idx}
                className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="absolute -top-3 -right-3">
                  <div className="px-3 py-1 bg-[#ffde21]/10 border border-[#ffde21]/20 rounded-full">
                    <span className="text-xs font-medium text-[#00674F]">{program.status}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-bold text-slate-900 mb-2">{program.name}</div>
                  <div className="text-sm text-slate-600 mb-3">{program.focus}</div>
                </div>
                <div className="text-xs text-slate-500 mb-4">Perfect for: {program.audience}</div>
                <button className="w-full py-3 border border-[#00674F]/20 text-[#00674F] rounded-lg hover:border-[#00674F] hover:bg-[#00674F]/5 transition-all duration-300">
                  Join Waitlist
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="#"
              className="inline-flex items-center px-6 py-3 border-2 border-[#ffde21] text-[#00674F] font-medium rounded-full hover:bg-[#00674F]/10 transition-all duration-300"
            >
              View All Upcoming Programs
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Your Financial Learning Journey Starts Here.
            </h3>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Whether you're learning to manage your own money or preparing to build a career in finance,
              Alphalabs gives you the space to explore, learn, and evolve. Start with our flagship F³ program
              and discover how empowering financial clarity can be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="#"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Enroll in F³
              </Link>
              <Link
                to="#"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-[#ffde21] text-[#00674F] font-bold rounded-full hover:bg-[#00674F]/10 transition-all duration-300"
              >
                Join the Alphalabs Community
              </Link>
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
          .group:hover\:-translate-y-1,
          .hover\:-translate-y-1,
          .group:hover .group-hover\:translate-x-1 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
