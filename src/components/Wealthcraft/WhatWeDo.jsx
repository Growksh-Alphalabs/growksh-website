import React from 'react'
import { COLORS } from '../../constants/colors'
import img from '../../assets/Website images/Wealthcraft - The wealthcraft way.png'

export default function WhatWeDo() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left: content */}
                    <div className="px-2 sm:px-0">
                        <div className="text-sm font-medium text-[#ffde21] mb-4 tracking-wider uppercase">
                            The Growksh Wealthcraft Way
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight animate-fadeUp">
                            Life changes.{' '}
                            <span className="text-[#ffde21]">
                                Your money should move with it.
                            </span>
                        </h2>

                        <p
                            className="mt-6 text-lg text-slate-600 leading-relaxed animate-fadeUp"
                            style={{ animationDelay: '120ms' }}
                        >
                            At Growksh Wealthcraft, we don't just create plans — we craft
                            financial frameworks that move with your life.
                        </p>

                        <p
                            className="mt-4 text-lg text-slate-600 leading-relaxed animate-fadeUp"
                            style={{ animationDelay: '120ms' }}
                        >
                            Our goal is simple: to give you complete clarity and control over
                            your money, so you can live with confidence and purpose.
                        </p>

                        <div
                            className="mt-8 animate-fadeUp"
                            style={{ animationDelay: '380ms' }}
                        >
                            <a
                                href="#consult"
                                className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-black shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:shadow-lg transition-shadow duration-300"
                                style={{ backgroundColor: COLORS.YELLOW }}
                                aria-label="Get started with a free consultation"
                            >
                                Get Started — Free Consultation
                            </a>
                        </div>
                    </div>

                    {/* Right: illustration / image */}
                    <div className="relative px-2 sm:px-0">
                        <div className="bg-yellow-50 rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden">
                            <div className="relative rounded-xl bg-white/60 border border-yellow-100 p-3 sm:p-4">
                                {/* Decorative yellow smoke / blob */}
                                <div
                                    className="absolute -right-6 -top-4 w-40 h-40 bg-yellow-200/30 rounded-full filter blur-3xl opacity-80 pointer-events-none"
                                    aria-hidden="true"
                                />

                                <img
                                    src={img}
                                    alt="Wealth planning illustration"
                                    className="w-full h-auto max-h-64 sm:max-h-72 md:max-h-80 object-cover rounded-md shadow-sm"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeUp {
            animation: none;
          }
          .animate-fadeUp[style] {
            animation: none !important;
          }
        }
        .blur-3xl {
          filter: blur(40px);
        }
      `}</style>
        </section>
    )
}