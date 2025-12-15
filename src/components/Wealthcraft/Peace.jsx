import React, { useState, useEffect } from 'react'
import { COLORS } from '../../constants/colors'
import defaultPeace from '../../assets/Website images/Wealthcraft - Financial Peace.png'
import imgP from '../../assets/Website images/Wealthcraft - Financial Peace - P.png'
import imgE from '../../assets/Website images/Wealthcraft - Financial Peace - E.png'
import imgA from '../../assets/Website images/Wealthcraft - Financial Peace - A.png'
import imgC from '../../assets/Website images/Wealthcraft - Financial Peace - C.png'
import imgE2 from '../../assets/Website images/Wealthcraft - Financial Peace - E (2).png'
import { Link } from 'react-router-dom'
const steps = [
    {
        short: 'P',
        title: 'Planning for Life Situations',
        paragraphs: [
            'Comprehensive financial strategies designed for every stage — early career, mid-life, retirement, and legacy planning.'
        ]
    },
    {
        short: 'E',
        title: 'Educated Financial Choices',
        paragraphs: [
            'Empowering you with clear, data-backed insights so every decision feels informed — not impulsive.'
        ]
    },
    {
        short: 'A',
        title: 'Achieving Financial Goals',
        paragraphs: [
            'Helping you reach your life goals — home purchase, child education, financial independence, or early retirement — through actionable strategies.'
        ]
    },
    {
        short: 'C',
        title: 'Create Wealth Mindfully',
        paragraphs: [
            'Wealth creation that aligns with your values — not just numbers on a spreadsheet.'
        ]
    },
    {
        short: 'E',
        title: 'Emotional Support',
        paragraphs: [
            'Financial guidance during uncertain times — because money is emotional, and you deserve steady advice that keeps you calm and confident.'
        ]
    }
]

export default function Peace() {
    const [active, setActive] = useState(null)
    const [reduceMotion, setReduceMotion] = useState(false)
    

    useEffect(() => {
        const media = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
        setReduceMotion(media ? media.matches : false)
        const handler = () => setReduceMotion(media.matches)
        if (media && media.addEventListener) media.addEventListener('change', handler)
        return () => media && media.removeEventListener && media.removeEventListener('change', handler)
    }, [])

    // (Removed dynamic accordion/image height syncing - using fixed responsive image height)

    return (
        <section id="peace" className="py-6 sm:py-8 bg-black text-white"> {/* Reduced padding */}
            <div className="max-w-max px-2 mx-2 sm:mx-4 md:mx-15"> {/* Reduced margins */}
                <div className="text-sm font-medium text-[#ffde21] mb-3 sm:mb-4 tracking-wider text-center uppercase"> {/* Reduced margin */}
                    Our Signature Approach
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white text-center px-2"> {/* Added padding for mobile */}
                    Financial <span className="text-[#ffde21]">P.E.A.C.E. </span> of Mind!
                </h2>
                <p className="mt-2 mb-2 sm:mt-3 sm:mb-3 text-slate-300 max-w-xl mx-auto animate-fadeSlow text-center px-2 sm:px-0"> {/* Reduced margins */}
                    A simple, time-tested framework that brings structure and serenity to your financial life.
                </p>

                {/* Accordion */}
                <div className="mt-4 sm:mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"> {/* Reduced gap and margin */}
                    <div className="space-y-1 sm:space-y-2"> {/* Reduced space between items */}
                        {steps.map((s, i) => (
                            <div key={s.short + i} className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
                                <button
                                    type="button"
                                    aria-expanded={active === i}
                                    aria-controls={`wealth-panel-${i}`}
                                    onClick={() => setActive(prev => prev === i ? null : i)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(prev => prev === i ? null : i) } }}
                                    className="w-full text-left px-3 py-2 flex items-center justify-between gap-2 sm:gap-3"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3"> {/* Reduced gap on mobile */}
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ffde21] text-black flex items-center justify-center font-bold text-xs sm:text-sm`}>{s.short}</div> {/* Smaller on mobile */}
                                        <div>
                                            <div className="font-semibold text-lg sm:text-xl text-white">{s.title}</div> {/* Smaller text on mobile */}
                                        </div>
                                    </div>
                                    <div className={`transition-transform ${active === i ? 'rotate-180' : 'rotate-0'}`}>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffde21]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Smaller icon on mobile */}
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    id={`wealth-panel-${i}`}
                                    className={`px-3 pb-2 sm:pb-3 transition-[max-height,opacity,padding] ${reduceMotion ? '' : 'duration-300 ease-in-out'}`}
                                    style={{ maxHeight: active === i ? '200px' : '0px', opacity: active === i ? 1 : 0, paddingTop: active === i ? '0.25rem' : 0 }}
                                >
                                    <div className="text-xs sm:text-sm text-slate-300"> {/* Smaller text on mobile */}
                                        {s.paragraphs.map((p, idx) => (
                                            <p key={idx} className="leading-snug">{p}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: image that matches accordion height */}
                    <div className="flex items-center justify-center px-1 sm:px-0 mx-1 sm:mx-2 md:mx-15"> {/* Reduced padding/margin */}
                            <div className="w-full max-w-2xl h-[40vh] rounded-2xl overflow-hidden shadow-lg bg-slate-800">
                                <img
                                    src={active === null ? defaultPeace : [imgP, imgE, imgA, imgC, imgE2][active]}
                                    alt={`Wealthcraft ${active === null ? 'Peace' : steps[active].short}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                            </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-8 text-center"> {/* Slightly larger margin for breathing room */}
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
                        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-4 rounded-full shadow-lg"
                        style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                        aria-label="Book a consultation to craft your financial peace"
                    >
                        <span className="font-semibold text-base sm:text-lg">Let's Craft Your Financial P.E.A.C.E.</span>
                    </a>
                </div>
            </div>
        </section>
    )
}