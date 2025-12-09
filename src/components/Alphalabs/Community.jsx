import React from 'react'
import { Link } from 'react-router-dom'

export default function Community() {
  const benefits = [
    {
      icon: '🎯',
      title: 'The F³ Circle',
      description: 'A supportive group of like-minded women who are learning, sharing, and growing together in their financial journey.​ A safe, judgment-free space to ask questions, learn from real stories, and build confidence. ',
      gradient: 'from-[#00674F]/10 to-[#009A7B]/10'
    },
    {
      icon: '📚',
      title: 'Resource Library – Worksheets, Templates & Toolkits',
      description: 'Download-ready worksheets, templates, calculators, and trackers that help you apply what you learn — without overwhelm.​ Simple tools you can use instantly to organize your money better. ',
      gradient: 'from-[#00674F]/10 to-[#005e48]/10'
    },
    {
      icon: '🤝',
      title: 'The Alpha Letter',
      description: 'A short, thoughtful monthly newsletter with practical personal finance insights, money habits, and relatable examples.​ No jargon — just clear, useful ideas to help you make better decisions. ',
      gradient: 'from-[#009A7B]/10 to-[#00674F]/10'
    }
  ]


  return (
    <section id="community" className="relative py-16 md:py-20 overflow-hidden">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffde21]/10 via-white to-[#ffde21]/5 -z-30" />
      
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
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Join{' '}
            <span className="relative inline-block">
              <span className="relative z-10">
                The <span className="bg-gradient-to-r from-[#00674F] via-[#009A7B] to-[#00674F] bg-clip-text text-transparent">Alpha Circle</span> - Our Learning Community
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00674F]/20 via-[#009A7B]/20 to-[#00674F]/20 blur-xl -z-10" />
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed mb-8">
            A free learning community — designed for individuals who want to stay financially aware, inspired, 
and connected. 
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-[#ffde21]/10 hover:border-[#ffde21]/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl"
            >
              {/* Corner Number */}
              <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-[#00674F]/20 flex items-center justify-center shadow-sm">
                <span className="text-xs md:text-sm font-bold text-[#00674F]">0{index + 1}</span>
              </div>
              
              {/* Icon Container */}
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} mb-6 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300`}>
                <span className="text-2xl md:text-3xl">{benefit.icon}</span>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {benefit.description}
                </p>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#00674F]/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Financial Journey?
            </h3>
            <p className="text-slate-600">
              Join thousands of learners who've found clarity, confidence, and community in the Alpha Circle.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="#"
              className="group inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#ffde21] to-[#ffde21]/50 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-sm md:text-base">Join The Alpha Circle</span>
              <svg 
                className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" 
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
          .group:hover\:-translate-y-2,
          .group:hover\:-translate-y-1 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}