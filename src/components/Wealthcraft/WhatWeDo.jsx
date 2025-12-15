import React from 'react'
import { COLORS } from '../../constants/colors'
import img from '../../assets/Website images/Wealthcraft - The wealthcraft way.png'
import { Link } from 'react-router-dom'

export default function WhatWeDo() {
    return (
        <section id="wealth-what-we-do" className="py-16 sm:py-24 bg-white" style={{ minHeight: '70vh' }}>
            {/* Normalized container and reduced mobile padding */}
            <div className="max-w-max mx-auto px-6 sm:px-8 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-28 items-center">
                    {/* Left: content - removed inner padding */}
                    <div className="px-0">
                        <div className="text-base font-semibold text-[#ffde21] mb-4 tracking-wider uppercase">
                            The Growksh Wealthcraft Way
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight animate-fadeUp">
                            Life changes.{' '}
                                Your money should move with it.
                        </h2>

                        <p
                            className="mt-6 text-xl text-slate-600 leading-relaxed animate-fadeUp"
                            style={{ animationDelay: '120ms' }}
                        >
                            At Growksh Wealthcraft, we don't just create plans — we craft
                            financial frameworks that move with your life.
                        </p>

                        <p
                            className="mt-4 text-xl text-slate-600 leading-relaxed animate-fadeUp"
                            style={{ animationDelay: '120ms' }}
                        >
                            Our goal is simple: to give you complete clarity and control over
                            your money, so you can live with confidence and purpose.
                        </p>

                        <div
                            className="mt-10 animate-fadeUp"
                            style={{ animationDelay: '380ms' }}
                        >
                            <a
                                href="https://calendly.com/financialfitnessbygrowksh/financial-fitness-discussion"
                                onClick={async (e) => {
                                    e && e.preventDefault && e.preventDefault()
                                    const base = 'https://calendly.com/financialfitnessbygrowksh/financial-fitness-discussion'

                                    const loadCalendlyScript = () => new Promise((resolve, reject) => {
                                        if (window.Calendly) return resolve()
                                        const s = document.createElement('script')
                                        s.src = 'https://assets.calendly.com/assets/external/widget.js'
                                        s.async = true
                                        s.onload = () => resolve()
                                        s.onerror = () => reject(new Error('Calendly script failed to load'))
                                        document.body.appendChild(s)
                                    })

                                    try {
                                        const calendlyModule = await import('react-calendly').catch(() => null)
                                        if (calendlyModule && typeof calendlyModule.openPopupWidget === 'function') {
                                            calendlyModule.openPopupWidget({ url: base })
                                            return
                                        }

                                        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                                            window.Calendly.initPopupWidget({ url: base })
                                            return
                                        }

                                        // load widget script then open inline popup
                                        await loadCalendlyScript()
                                        if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                                            window.Calendly.initPopupWidget({ url: base })
                                            return
                                        }

                                        window.open(base, '_blank', 'noopener,noreferrer')
                                    } catch (err) {
                                        console.warn('Calendly open failed', err)
                                        window.open(base, '_blank', 'noopener,noreferrer')
                                    }
                                }}
                                className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-black shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:shadow-lg transition-shadow duration-300"
                                style={{ backgroundColor: COLORS.YELLOW }}
                                aria-label="Get started with a free consultation"
                            >
                                Get Started — Free Consultation
                            </a>
                        </div>
                    </div>

                    {/* Right: illustration / image - removed inner padding */}
                    <div className="relative px-0">
                        <div className="bg-yellow-50 rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden">
                            <div className="relative rounded-xl bg-white/60 border border-yellow-100 p-3 sm:p-4">
                                {/* Decorative yellow smoke / blob */}
                                <div
                                    className="absolute -right-8 -top-6 w-56 h-56 bg-yellow-200/30 rounded-full filter blur-3xl opacity-80 pointer-events-none"
                                    aria-hidden="true"
                                />

                                <img
                                    src={img}
                                    alt="Wealth planning illustration"
                                    className="w-full h-auto max-h-96 sm:max-h-[28rem] md:max-h-[32rem] lg:max-h-[36rem] object-cover rounded-md shadow-sm"
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