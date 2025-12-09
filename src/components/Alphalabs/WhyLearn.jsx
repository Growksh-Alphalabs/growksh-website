import React from 'react'

export default function WhyLearn() {
  const features = [
    {
      icon: '🧠',
      title: 'Experiential & Interactive',
      description: 'Learn by applying concepts in real-time through simulations, case studies, and hands-on exercises — not just memorizing theory.',
      color: 'from-[#00674F]/10 to-[#009A7B]/10'
    },
    {
      icon: '🤝',
      title: 'Community-Driven',
      description: 'Join a supportive tribe that speaks your financial language, shares insights, and grows together through collaborative learning.',
      color: 'from-[#004D36]/10 to-[#00674F]/10'
    },
    {
      icon: '🎓',
      title: 'Expert-Led',
      description: 'Guided by Certified Financial Planner™ Krutika Kathal and domain specialists with real-world financial planning experience.',
      color: 'from-[#00674F]/10 to-[#005e48]/10'
    },
    {
      icon: '💫',
      title: 'Transformative, Not Transactional',
      description: 'We teach you how to think about money differently — building financial intelligence that lasts a lifetime.',
      color: 'from-[#009A7B]/10 to-[#004D36]/10'
    }
  ]

  return (
    <section id="why-learn" className="relative py-16 md:py-20 overflow-hidden">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffde21]/10 via-white to-[#ffde21]/5 -z-30" />
      
      {/* Green Cloud Blur Background */}
      <div className="absolute inset-0 -z-20 opacity-40">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cloudGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#00674F" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00674F" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <g filter="url(#cloudBlur)">
            <path d="M-100,200 C100,0 300,100 500,50 C700,0 900,100 1100,50 C1300,0 1500,200 1300,400 C1100,600 900,500 700,550 C500,600 300,500 100,550 C-100,600 -100,300 -100,200 Z" fill="url(#cloudGrad)" />
            <path d="M0,300 C200,150 400,250 600,200 C800,150 1000,250 1200,200 C1400,150 1600,300 1400,450 C1200,600 1000,550 800,600 C600,650 400,550 200,600 C0,650 0,400 0,300 Z" fill="#00674F" fillOpacity="0.05" />
          </g>
        </svg>
      </div>
      
      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00674F]/10 border border-[#00674F]/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#00674F] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#00674F] uppercase tracking-wide">WHY LEARN WITH US </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            What Makes{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#00674F] to-[#009A7B] bg-clip-text text-transparent">
                Alphalabs
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00674F]/20 to-[#009A7B]/20 blur-xl rounded-lg -z-10" />
            </span>
            {' '}Different
          </h2>
          
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            We're not just another finance course. We're a learning ecosystem designed to transform how you think, 
            act, and grow with money through four core pillars.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#00674F]/10 hover:border-[#00674F]/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl"
            >
              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-bl-2xl rounded-tr-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-[#ffde21]/60 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border-2 border-[#00674F] flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-[#00674F]">{index + 1}</span>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  {feature.title}
                  <span className="w-4 h-0.5 bg-[#00674F] block group-hover:w-8 transition-all duration-300" />
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Hover Effect Line (use width transition instead of scaleX) */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00674F] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 w-0 group-hover:w-full origin-center" />
            </div>
          ))}
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

        @keyframes float-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .group:hover .w-16.h-16 {
          animation: float-subtle 0.6s ease-in-out;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
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