import React from 'react'
import { Link } from 'react-router-dom'

export default function CTASection() {
    return (
        <div className="relative">
            {/* Dark Theme CTA Section */}
            <section className="relative py-20 bg-black overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #ffde21 2px, transparent 0)`,
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                {/* Glowing Orbs */}
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-amber-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-tl from-yellow-400/10 to-amber-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                {/* Animated Rings */}
                <div className="absolute top-1/2 left-1/2 w-full max-w-4xl h-64 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 border-2 border-yellow-400/10 rounded-full animate-ping-slow" />
                    <div className="absolute inset-8 border-2 border-yellow-400/15 rounded-full animate-ping-slower" />
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-400/20 rounded-full mb-8">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-yellow-300">YOUR JOURNEY STARTS HERE</span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                            Ready to Start Your{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                                    Learning Journey
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-300/20 to-yellow-400/20 blur-xl -z-10" />
                            </span>
                            ?
                        </h2>

                        {/* Description */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Whether you want to understand your finances, upskill for your career, or simply build more awareness around money —
                                Growksh Alphalabs gives you the tools to think better, decide better, and live better.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                            <Link to="#programs"
                                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span>Explore Programs</span>
                                <svg
                                    className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            <Link to="#community"
                                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-400/30 text-yellow-300 font-bold rounded-full hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span>Join The Community</span>
                                <svg
                                    className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform"
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
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          @keyframes ping-slower {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }

          .animate-ping-slow {
            animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          .animate-ping-slower {
            animation: ping-slower 6s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          /* Reduce motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-ping-slow,
            .animate-ping-slower,
            .animate-pulse {
              animation: none;
            }
          }
        `}</style>
            </section>

            {/* Light Theme Disclosure Section */}
            <section className="relative py-16 bg-white">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-50/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-50/30 to-transparent" />

                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(45deg, #ffde21 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="text-center">


                        {/* Content Card */}
                        <div className="bg-gradient-to-b from-white to-yellow-50/30 rounded-2xl border-2 border-yellow-100 p-8 md:p-12 shadow-sm">

                            {/* Main Content */}
                            <div className="max-w-2xl mx-auto">
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    <span className="font-semibold text-slate-900">Growksh Alphalabs</span> is the learning & education arm of the Growksh ecosystem.
                                    It focuses exclusively on financial education and awareness programs.
                                    No investment advice or product distribution is offered under this vertical.

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}