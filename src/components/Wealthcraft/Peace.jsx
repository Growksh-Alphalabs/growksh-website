import React, { useState, useEffect, useRef } from 'react'
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
    const [accordionHeight, setAccordionHeight] = useState('auto')
    const accordionRef = useRef(null)

    useEffect(() => {
        const media = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
        setReduceMotion(media ? media.matches : false)
        const handler = () => setReduceMotion(media.matches)
        if (media && media.addEventListener) media.addEventListener('change', handler)
        return () => media && media.removeEventListener && media.removeEventListener('change', handler)
    }, [])

    // Update accordion height when active changes
    useEffect(() => {
        if (accordionRef.current) {
            const height = accordionRef.current.offsetHeight
            setAccordionHeight(`${height}px`)
        }
    }, [active])

    return (
        <section className="py-6 sm:py-8 bg-black text-white"> {/* Reduced padding */}
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
                    <div ref={accordionRef} className="space-y-1 sm:space-y-2"> {/* Reduced space between items */}
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
                                            <div className="font-semibold text-xs sm:text-sm text-white">{s.title}</div> {/* Smaller text on mobile */}
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
                    <div className="flex items-center justify-center px-1 sm:px-0 mx-1 sm:mx-2 md:mx-15" style={{ height: accordionHeight }}> {/* Reduced padding/margin */}
                            <div className="w-full max-w-2xl h-[50vh] rounded-2xl overflow-hidden shadow-lg bg-slate-800">
                                <img
                                    src={active === null ? defaultPeace : [imgP, imgE, imgA, imgC, imgE2][active]}
                                    alt={`Wealthcraft ${active === null ? 'Peace' : steps[active].short}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                            </div>
                    </div>
                </div>

                <div className="mt-4 sm:mt-6 text-center"> {/* Reduced margin */}
                    <Link
                        to="#book"
                        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 rounded-full" 
                        style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                        aria-label="Book a consultation to craft your financial peace"
                    >
                        <span className="font-semibold text-sm sm:text-base">Let's Craft Your Financial P.E.A.C.E.</span> {/* Smaller text on mobile */}
                    </Link>
                </div>
            </div>
        </section>
    )
}