import React from 'react'

const testimonials = [
  {
    name: 'Neha Gangrade',
    quote: `Thank you Growksh team, specially Krutika, for providing help and support at each and every step in my journey of learning basics about trading. You guys have been extremely patient in answering all the queries.`,
    role: 'Learner',
  },
  {
    name: 'Satyawan Aglawe',
    quote: `Hi Growksh team, first of all thank you So much for all your support and handholding. You made trading so easy that anybody can do it and enjoy the freedom of time and money in long run. You guys are simply awesome, kind hearted and always ready to help. You are strategic thinkers, and your system oriented approach is a must learn for everyone. More blessings and power to you to touch many more lives !! Thank you so much for all the knowledge and help !!`,
    role: 'Learner',
  }
]

export default function Testimonials(){
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
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
        {[...Array(10)].map((_, i) => (
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
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Learners Who Found Their{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#00674F] to-[#009A7B] bg-clip-text text-transparent">
                Alpha
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00674F]/20 to-[#009A7B]/20 blur-xl -z-10" />
            </span>
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hear from our community members about their transformative learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <article key={i} className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Green Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#00674F]/10 to-[#009A7B]/10 rounded-bl-3xl rounded-tr-3xl" />
              
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#00674F] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <div className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#00674F] to-[#005e48] flex items-center justify-center text-xl font-semibold text-white shadow-lg">
                    {t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-[#00674F] font-medium mb-1">{t.role}</div>
                  <p className="mt-3 text-slate-700 leading-relaxed text-sm md:text-base">"{t.quote}"</p>
                  
                  {/* Name Badge */}
                  <div className="mt-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00674F]/5 text-sm font-medium text-[#00674F] border border-[#00674F]/10 group-hover:bg-[#00674F]/10 group-hover:border-[#00674F]/20 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{t.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00674F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </article>
          ))}
        </div>

        {/* View More CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00674F]/30 text-[#00674F] font-medium rounded-full hover:border-[#00674F]/50 hover:bg-[#00674F]/5 transition-all duration-300">
            <span>View More Testimonials</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
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
          .group:hover\:-translate-y-2 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}