import React from 'react'

export default function Programs() {
  const comingSoonPrograms = [
    { name: 'The Financial Foundations Lab', audience: 'Working professionals & young earners', focus: 'Personal finance fundamentals', status: 'Coming Soon' },
    { name: 'The Financial Planning Accelerator', audience: 'Finance students & aspiring planners', focus: 'Applied financial planning skills', status: 'Coming Soon' },
    { name: 'CFA / CA Enrichment Tracks', audience: 'Finance aspirants & professionals', focus: 'Real-world case application', status: 'Coming Soon' },
    { name: 'The Alpha Life Series', audience: 'Anyone interested in growth', focus: 'Finance, health & purpose connection', status: 'Coming Soon' }
  ]

  return (
    <section id="programs" className="relative py-20 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffde21 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="relative inline-block">
              <span className="relative z-10">OUR LEARNING EXPERIENCES</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-400/20 -z-10" />
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Each program at Alphalabs is designed to meet learners where they are — from foundational money skills to advanced financial understanding.
          </p>
        </div>

        {/* Flagship Program */}
        <div className="relative mb-20">
          {/* Badge */}
          <div className="absolute -top-4 left-4 z-20">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg">
              <span className="text-lg">💎</span>
              <span className="text-sm font-bold text-black">FLAGSHIP PROGRAM</span>
            </div>
          </div>
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-yellow-400/20 p-8 md:p-12 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -translate-y-32 translate-x-32" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    F³ <span className="text-yellow-400">(Financial Fitness for Females)</span>
                  </h3>
                  <p className="text-lg text-yellow-300 font-medium mb-4">
                    Making women Financially Aware • Financially Able • Financially Assured
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    F³ is a three-level journey that helps women move from confusion to confidence with their finances. 
                    It combines structured coaching, real-life examples, and actionable tools that make money management 
                    simple, practical, and empowering.
                  </p>
                </div>
                <div className="md:w-48">
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-4">
                    <div className="text-yellow-400 text-sm font-bold mb-2">PERFECT FOR</div>
                    <ul className="text-gray-300 text-sm space-y-1">
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
                <div className="group relative bg-gradient-to-b from-gray-900/80 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold">01</span>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-xl font-bold text-white mb-3">The Awareness Bootcamp</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-yellow-300">Build clarity • Break confusion</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Become financially aware and lay a strong foundation for long-term financial well-being by learning 6 pillars of financial planning in a simplified, structured, and relatable manner.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-gray-400">Women who want to understand their money before managing it.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-gray-400">Pre-recorded videos + Q&A session + practical worksheets + real-life case studies</p>
                    </div>
                    <a 
                      href="#" 
                      className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Enroll in Level 1
                    </a>
                  </div>
                </div>

                {/* Level 2 */}
                <div className="group relative bg-gradient-to-b from-gray-900/80 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold">02</span>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-xl font-bold text-white mb-3">The Ability Accelerator</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-yellow-300">From knowing to doing</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Design a working money system — from saving and investing, to insurance, and building your financial base step by step.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-gray-400">Women ready to take control of their financial life actively.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-gray-400">Detailed coaching videos, tools, templates, calculators and live group sessions</p>
                    </div>
                    <a 
                      href="#" 
                      className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Join Level 2
                    </a>
                  </div>
                </div>

                {/* Level 3 */}
                <div className="group relative bg-gradient-to-b from-gray-900/80 to-black p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold">03</span>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-xl font-bold text-white mb-3">The Assurance Advantage</h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-4">
                      <span className="text-xs font-medium text-yellow-300">Expert care for your money</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      A personalized, one-on-one financial consultation & portfolio oversight for women who want peace of mind, not more to-do lists.
                    </p>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">IDEAL FOR</div>
                      <p className="text-xs text-gray-400">Women who prefer a professional to manage their finances end-to-end.</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-yellow-400 font-bold mb-2">FORMAT</div>
                      <p className="text-xs text-gray-400">One-on-one financial consultation and implementation via Growksh Wealthcraft</p>
                    </div>
                    <a 
                      href="#" 
                      className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Apply for Level 3
                    </a>
                  </div>
                </div>
              </div>

              {/* Why Women Love F³ */}
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 p-6 mb-8">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">✨</span>
                  Why Women Love F³
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    'Step-by-step structure — no jargon, no overwhelm',
                    'Designed by a woman, for women',
                    'Builds financial confidence',
                    'Lifetime access to materials',
                    'Optional upgrade to consultation'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      </div>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main CTA */}
              <div className="text-center">
                <a 
                  href="#" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>Join The Awareness Bootcamp Today</span>
                  <svg 
                    className="w-5 h-5 ml-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Programs */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              <span className="relative inline-block">
                <span className="relative z-10">Coming Soon: More Learning Programs</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-400/20 -z-10" />
              </span>
            </h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We're continuously expanding our Alphalabs ecosystem to include new experiential programs across professions, life stages, and learning goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonPrograms.map((program, idx) => (
              <div 
                key={idx} 
                className="group relative bg-gradient-to-b from-gray-900 to-black p-6 rounded-2xl border-2 border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute -top-3 -right-3">
                  <div className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                    <span className="text-xs font-medium text-yellow-300">{program.status}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-bold text-white mb-2">{program.name}</div>
                  <div className="text-sm text-gray-400 mb-3">{program.focus}</div>
                </div>
                <div className="text-xs text-gray-500 mb-4">Perfect for: {program.audience}</div>
                <button className="w-full py-3 border border-gray-700 text-gray-400 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                  Join Waitlist
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="#" 
              className="inline-flex items-center px-6 py-3 border-2 border-yellow-400 text-yellow-400 font-medium rounded-full hover:bg-yellow-400/10 transition-all duration-300"
            >
              View All Upcoming Programs
            </a>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              Your Financial Learning Journey Starts Here.
            </h3>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Whether you're learning to manage your own money or preparing to build a career in finance, 
              Alphalabs gives you the space to explore, learn, and evolve. Start with our flagship F³ program 
              and discover how empowering financial clarity can be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Enroll in F³
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-bold rounded-full hover:bg-yellow-400/10 transition-all duration-300"
              >
                Join the Alphalabs Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}