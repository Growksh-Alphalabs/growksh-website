import React from 'react'

export default function WhyLearn() {
  const features = [
    {
      icon: '🧠',
      title: 'Experiential & Interactive',
      description: 'Learn by applying concepts in real-time through simulations, case studies, and hands-on exercises — not just memorizing theory.',
      color: 'from-blue-50 to-blue-100'
    },
    {
      icon: '🤝',
      title: 'Community-Driven',
      description: 'Join a supportive tribe that speaks your financial language, shares insights, and grows together through collaborative learning.',
      color: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: '🎓',
      title: 'Expert-Led',
      description: 'Guided by Certified Financial Planner™ Krutika Kathal and domain specialists with real-world financial planning experience.',
      color: 'from-purple-50 to-purple-100'
    },
    {
      icon: '💫',
      title: 'Transformative, Not Transactional',
      description: 'We teach you how to think about money differently — building financial intelligence that lasts a lifetime.',
      color: 'from-amber-50 to-amber-100'
    }
  ]

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-50/30 to-amber-50/20 rounded-full -translate-x-1/4 -translate-y-1/4 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-50/20 to-purple-50/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffde21 1px, transparent 0)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-yellow-700">WHY LEARN WITH GROWKSH ALPHALABS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Makes{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Alphalabs
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 blur-xl rounded-lg -z-10" />
            </span>
            {' '}Different
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're not just another finance course. We're a learning ecosystem designed to transform how you think, 
            act, and grow with money through four core pillars.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-yellow-300 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-lg"
            >
              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-bl-2xl rounded-tr-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 flex items-center justify-center shadow-sm">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border-2 border-yellow-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  {feature.title}
                  <span className="w-4 h-0.5 bg-yellow-400 block group-hover:w-8 transition-all duration-300" />
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-center" />
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        @keyframes float-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .group:hover .w-16.h-16 {
          animation: float-subtle 0.6s ease-in-out;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .group:hover .w-16.h-16,
          .group:hover\:-translate-y-2 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}