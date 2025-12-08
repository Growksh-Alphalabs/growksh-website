import React from 'react'
import { Link } from 'react-router-dom'

export default function CTASection() {
    return (
        <div className="relative">
            {/* Main CTA Section */}
            <section className="relative py-16 md:py-20 overflow-hidden">
                {/* Abstract Yellow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffde21]/10 via-white to-[#ffde21]/5 -z-30" />
                
                {/* Main Abstract Pattern */}
                <div className="absolute inset-0 -z-20 overflow-hidden opacity-40">
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
                                <stop offset="0%" stopColor="#ffde21" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#ffde21" stopOpacity="0.08" />
                            </linearGradient>
                            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffde21" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="#ffde21" stopOpacity="0.06" />
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
                            className="absolute w-1 h-1 bg-[#ffde21]/15 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${10 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                {/* Subtle yellow glows */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffde21]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffde21]/5 rounded-full blur-3xl" />

                {/* Animated Rings */}
                <div className="absolute top-1/2 left-1/2 w-full max-w-4xl h-64 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 border-2 border-[#ffde21]/10 rounded-full animate-ping-slow" />
                    <div className="absolute inset-8 border-2 border-[#ffde21]/15 rounded-full animate-ping-slower" />
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center">
                        {/* Headline */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Start Your Financial {' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-[#ffde21] via-[#ffde21] to-[#ffde21] bg-clip-text text-transparent">
                                    P.E.A.C.E. Journey
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#ffde21]/20 via-[#ffde21]/20 to-[#ffde21]/20 blur-xl -z-10" />
                            </span>
                            ?
                        </h2>

                        {/* Description */}
                        <div className="max-w-2xl mx-auto mb-10 md:mb-12">
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Financial freedom begins with clarity. Let's start with a conversation.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                            <Link to="#programs"
                                className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#ffde21] to-[#ffde21] text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span className="text-sm md:text-base">Schedule a Discovery Call</span>
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            <Link to="#community"
                                className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-[#ffde21]/30 text-[#ffde21] font-bold rounded-full hover:border-[#ffde21]/50 hover:bg-[#ffde21]/5 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span className="text-sm md:text-base">Download the Wealthcraft Brochure</span>
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

                    @keyframes ping-slow {
                        75%, 100% {
                            transform: translateY(-8px);
                            opacity: 0;
                        }
                    }

                    @keyframes ping-slower {
                        75%, 100% {
                            transform: translateY(-12px);
                            opacity: 0;
                        }
                    }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-ping-slow {
            animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          .animate-ping-slower {
            animation: ping-slower 6s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          /* Reduce motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-float,
            .animate-ping-slow,
            .animate-ping-slower,
            .animate-pulse,
                    .group:hover\:-translate-y-1 {
                        animation: none;
                        transform: none;
                    }
          }
        `}</style>
            </section>

          
        </div>
    )
}