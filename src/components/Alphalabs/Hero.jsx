import React from 'react'
import AlphalabsLogo from '../../assets/Website images/Alphalabs logo.png'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="alphalabs-hero" className="relative overflow-hidden  text-slate-900">
      {/* Abstract Green Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00674F]/10 via-white to-[#00674F]/5 -z-30" />
      
      {/* Main Abstract Pattern */}
      <div className="absolute inset-0 -z-20 overflow-hidden opacity-30 md:opacity-40">
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
          
          {/* Dots Pattern */}
          <g>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 800}
                r={Math.random() * 3 + 1}
                fill="#00674F"
                opacity={Math.random() * 0.1 + 0.05}
              />
            ))}
          </g>
        </svg>
      </div>
      
      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Animated Particles - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00674F]/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Subtle green glows - Adjusted for mobile */}
      <div className="absolute -top-20 -right-20 w-60 h-60 md:-top-40 md:-right-40 md:w-80 md:h-80 bg-[#00674F]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 md:-bottom-40 md:-left-40 md:w-80 md:h-80 bg-[#00674F]/5 rounded-full blur-3xl" />

      {/* Abstract green cloud - Hidden on mobile, shown on tablet+ */}
      <svg className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-full max-w-6xl h-auto -z-20 pointer-events-none opacity-30" viewBox="0 0 1100 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <filter id="blobBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cloudGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#00674F" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#00674F" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <g filter="url(#blobBlur)">
          <path d="M80 160C120 80 240 40 360 64C480 88 620 28 740 72C860 116 980 140 1020 196C1060 252 980 332 860 344C740 356 620 316 500 320C380 324 200 360 80 320C-40 280 40 240 80 160Z" fill="url(#cloudGrad)" />
          <path d="M220 100C300 40 420 24 540 56C660 88 780 20 880 68C980 116 1040 176 990 232C940 288 820 312 700 312C580 312 420 292 300 304C180 316 140 220 220 100Z" fill="#00674F" fillOpacity="0.06" />
        </g>
      </svg>

      {/* Wider, full-width container with outer margins */}
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 items-center gap-6 md:gap-8 lg:gap-12">
          {/* Text Content - Slightly larger spacing */}
          <div className="py-6 md:py-8 lg:py-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-3 bg-white/80 backdrop-blur-sm border border-[#00674F]/20 rounded-full mb-4 md:mb-6">
              <img src={AlphalabsLogo} alt="Alphalabs" className="w-6 h-6 md:w-7 md:h-7 rounded-sm" />
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#00674F] rounded-full animate-pulse" />
              <span className="text-sm md:text-base font-medium text-[#00674F] uppercase tracking-wide">
                Alphalabs by Growksh
              </span>
            </div>

            {/* Headline - Mobile responsive font sizes */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-tight">
              Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#00674F]">
                  financial
                </span>
                <span className="absolute inset-0 bg-[#00674F]/10 blur-xl -z-10" />
              </span> <br/>
               <span className="relative inline-block">
                 <span className="relative z-10 text-[#00674F]">
                   learning{' '}
                 </span>
                 <span className="absolute inset-0 bg-[#00674F]/10 blur-xl -z-10" />
              </span>
             {' '} studio.
            </h1>

            {/* Description */}
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-slate-700 leading-relaxed">
              Growksh Alphalabs is an experiential learning studio by Growksh — designed to help individuals think, decide, 
              and grow smarter with money. Here, finance isn't just taught — it's experienced, questioned, and understood 
              deeply, so you can make better choices in your financial life and beyond.
            </p>

            {/* CTA Buttons - Stack on mobile */}
            <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <Link 
                to="#programs" 
                className="group inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#00674F] to-[#005e48] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
              >
                Explore Programs
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                to="#community" 
                className="inline-flex items-center justify-center px-5 py-3 md:px-6 md:py-4 border-2 border-[#ffde21] text-[#000] font-medium rounded-full hover:border-[#00674F]/50 hover:bg-white/50 transition-all duration-300 text-sm md:text-base"
              >
                Join the Learning Circle
              </Link>
            </div>

          </div>

          {/* Right Visual - Always below text on mobile, side by side on desktop */}
          <div className="relative py-4 md:py-6 lg:py-8 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-2xl">
              {/* Main Container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border-2 border-[#00674F]/10 p-4 md:p-6 lg:p-8 shadow-xl md:shadow-2xl overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00674F]/5 via-transparent to-[#00674F]/5" />
                
                {/* Network Visualization */}
                <svg 
                  viewBox="0 0 460 360" 
                  className="w-full h-auto max-h-72 md:max-h-80 p-2 md:p-4" 
                  role="img" 
                  aria-label="Interactive learning network showing progression from thinking to growth"
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00674F" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#005e48" stopOpacity="0.85" />
                    </linearGradient>
                    
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00674F" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#005e48" stopOpacity="0.18" />
                    </linearGradient>
                    
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connection Lines with Animation */}
                  <g className="connections" stroke="url(#grad2)" strokeWidth="2" strokeOpacity="0.3">
                    <line x1="80" y1="80" x2="220" y2="60" className="connection" />
                    <line x1="220" y1="60" x2="340" y2="120" className="connection" />
                    <line x1="120" y1="180" x2="220" y2="60" className="connection" />
                    <line x1="220" y1="60" x2="240" y2="240" className="connection" />
                  </g>

                  {/* Animated Pulse Dots */}
                  <g className="pulses">
                    <circle className="pulse" cx="80" cy="80" r="1.5" />
                    <circle className="pulse delay-1" cx="220" cy="60" r="1.5" />
                    <circle className="pulse delay-2" cx="340" cy="120" r="1.5" />
                    <circle className="pulse delay-3" cx="120" cy="180" r="1.5" />
                    <circle className="pulse delay-4" cx="240" cy="240" r="1.5" />
                  </g>

                  {/* Main Nodes with Glow */}
                  <g className="nodes">
                    <circle className="node a" cx="80" cy="80" r="20" fill="url(#grad1)" filter="url(#glow)" />
                    <circle className="node b" cx="220" cy="60" r="24" fill="url(#grad1)" filter="url(#glow)" />
                    <circle className="node c" cx="340" cy="120" r="18" fill="url(#grad1)" filter="url(#glow)" />
                    <circle className="node d" cx="120" cy="180" r="18" fill="url(#grad1)" filter="url(#glow)" />
                    <circle className="node e" cx="240" cy="240" r="22" fill="url(#grad1)" filter="url(#glow)" />
                  </g>

                  {/* Labels */}
                  <g fontSize="14" fontWeight="600" textAnchor="middle" fill="#053927">
                    <text x="80" y="115" className="label">Think</text>
                    <text x="220" y="95" className="label">Learn</text>
                    <text x="340" y="155" className="label">Experiment</text>
                    <text x="120" y="215" className="label">Practice</text>
                    <text x="240" y="280" className="label">Grow</text>
                  </g>
                </svg>

                {/* Decorative Elements - Hidden on mobile, shown on tablet+ */}
                <div className="hidden md:block absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00674F]/20" />
                <div className="hidden md:block absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00674F]/20" />
                <div className="hidden md:block absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00674F]/20" />
                <div className="hidden md:block absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00674F]/20" />
              </div>

              {/* Floating Cards - Hidden on mobile, shown on tablet+ */}
              <div className="hidden md:block absolute -top-2 -right-2 md:-top-3 md:-right-3 lg:-top-4 lg:-right-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-[#ffde21] shadow-lg w-32 md:w-36 lg:w-40">
                <div className="text-xs text-[#00674F] font-bold mb-1">EXPERIENTIAL</div>
                <div className="text-sm text-slate-800">Learn by doing</div>
              </div>
              
              <div className="hidden md:block absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 lg:-bottom-4 lg:-left-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-[#ffde21] shadow-lg w-32 md:w-36 lg:w-40">
                <div className="text-xs text-[#00674F] font-bold mb-1">PRACTICAL</div>
                <div className="text-sm text-slate-800">Real-world skills</div>
              </div>
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
            transform: translateY(-20px);
          }
        }

        @keyframes pop {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }

        @keyframes pulseTravel {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-12px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .nodes .node {
          animation: pop 3s ease-in-out infinite;
        }

        .nodes .node.a { animation-delay: 0s; }
        .nodes .node.b { animation-delay: 0.8s; }
        .nodes .node.c { animation-delay: 1.6s; }
        .nodes .node.d { animation-delay: 2.4s; }
        .nodes .node.e { animation-delay: 3.2s; }

        .connections line {
          stroke-dasharray: 4, 3;
          animation: dash 20s linear infinite;
        }

        .connections line:nth-child(1) { animation-delay: 0s; }
        .connections line:nth-child(2) { animation-delay: 0.2s; }
        .connections line:nth-child(3) { animation-delay: 0.4s; }
        .connections line:nth-child(4) { animation-delay: 0.6s; }

        .pulse {
          fill: url(#grad2);
          animation: pulseTravel 1.6s linear infinite;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.6s; }
        .delay-2 { animation-delay: 1.2s; }
        .delay-3 { animation-delay: 1.8s; }
        .delay-4 { animation-delay: 2.4s; }

        .label {
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .nodes .node,
          .connections line,
          .pulse {
            animation: none;
          }
          .connections line {
            stroke-dasharray: none;
          }
        }
      `}</style>
    </section>
  )
}