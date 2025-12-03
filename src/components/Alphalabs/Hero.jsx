import React from 'react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 bg-black">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 text-left">
        <div className="grid lg:grid-cols-2 items-center gap-12">
          <div className="py-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-yellow-300 uppercase tracking-wide">
                The Financial Learning Studio
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Where financial understanding turns into{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  life confidence
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-yellow-400/20 blur-xl -z-10" />
              </span>
              .
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
              Growksh Alphalabs is an experiential learning studio by Growksh — designed to help individuals think, decide, 
              and grow smarter with money. Here, finance isn't just taught — it's experienced, questioned, and understood 
              deeply, so you can make better choices in your financial life and beyond.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a 
                href="#programs" 
                className="group inline-flex items-center px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore Programs
                <svg 
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href="#community" 
                className="inline-flex items-center px-6 py-4 border-2 border-yellow-400/30 text-yellow-300 font-medium rounded-full hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300"
              >
                Join the Learning Circle
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">500+</div>
                <div className="text-sm text-gray-400">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">98%</div>
                <div className="text-sm text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Learning Access</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative py-8 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Main Container */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-yellow-400/20 p-8 shadow-2xl overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5" />
                
                {/* Network Visualization */}
                <svg 
                  viewBox="0 0 460 360" 
                  className="w-full h-full p-4" 
                  role="img" 
                  aria-label="Interactive learning network showing progression from thinking to growth"
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
                    </linearGradient>
                    
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
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
                  <g fontSize="14" fontWeight="600" textAnchor="middle" fill="#ffffff">
                    <text x="80" y="115" className="label">Think</text>
                    <text x="220" y="95" className="label">Learn</text>
                    <text x="340" y="155" className="label">Experiment</text>
                    <text x="120" y="215" className="label">Practice</text>
                    <text x="240" y="280" className="label">Grow</text>
                  </g>
                </svg>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-yellow-400/30" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-yellow-400/30" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-yellow-400/30" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-yellow-400/30" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-yellow-400/20 shadow-lg w-40">
                <div className="text-xs text-yellow-400 font-bold mb-1">EXPERIENTIAL</div>
                <div className="text-sm text-white">Learn by doing</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-yellow-400/20 shadow-lg w-40">
                <div className="text-xs text-yellow-400 font-bold mb-1">PRACTICAL</div>
                <div className="text-sm text-white">Real-world skills</div>
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
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
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
            transform: scale(0.5);
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .nodes .node {
          animation: pop 4s ease-in-out infinite;
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
          animation: pulseTravel 3s linear infinite;
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