import React, { useState, useEffect } from 'react'
import { COLORS } from '../../constants/colors'
import defaultPeace from '../../assets/Website images/Wealthcraft - Financial Peace.png'
import imgP from '../../assets/Website images/Wealthcraft - Financial Peace - P.png'
import imgE from '../../assets/Website images/Wealthcraft - Financial Peace - E.png'
import imgA from '../../assets/Website images/Wealthcraft - Financial Peace - A.png'
import imgC from '../../assets/Website images/Wealthcraft - Financial Peace - C.png'
import imgE2 from '../../assets/Website images/Wealthcraft - Financial Peace - E (2).png'

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

    return (
        <section className="py-12 bg-slate-900 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-sm font-medium text-[#ffde21] mb-4 tracking-wider text-center uppercase">
                    Our Signature Approach
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white text-center">
                    Financial <span className="text-[#ffde21]">P.E.A.C.E. </span> of Mind!

                </h2>
                <p className="mt-3 mb-3 text-slate-300 max-w-xl mx-auto animate-fadeSlow text-center">
                    A simple, time-tested framework that brings structure and serenity to your financial life.
                </p>

                {/* Accordion (wider) */}
                <div className="mt-6 mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        {steps.map((s, i) => (
                            <div key={s.short + i} className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
                                <button
                                    type="button"
                                    aria-expanded={active === i}
                                    aria-controls={`wealth-panel-${i}`}
                                    onClick={() => setActive(prev => prev === i ? null : i)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(prev => prev === i ? null : i) } }}
                                    className="w-full text-left px-3 py-2 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-[#ffde21] text-black flex items-center justify-center font-bold text-sm`}>{s.short}</div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">{s.title}</div>
                                        </div>
                                    </div>
                                    <div className={`transition-transform ${active === i ? 'rotate-180' : 'rotate-0'}`}>
                                        <svg className="w-4 h-4 text-[#ffde21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    id={`wealth-panel-${i}`}
                                    className={`px-3 pb-3 transition-[max-height,opacity,padding] ${reduceMotion ? '' : 'duration-300 ease-in-out'}`}
                                    style={{ maxHeight: active === i ? '200px' : '0px', opacity: active === i ? 1 : 0, paddingTop: active === i ? '0.25rem' : 0 }}
                                >
                                    <div className="text-sm text-slate-300">
                                        {s.paragraphs.map((p, idx) => (
                                            <p key={idx} className="leading-snug">{p}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: image that changes with active accordion */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg bg-slate-800">
                            <img
                                src={active === null ? defaultPeace : [imgP, imgE, imgA, imgC, imgE2][active]}
                                alt={`Wealthcraft ${active === null ? 'Peace' : steps[active].short}`}
                                className="w-full h-64 sm:h-72 object-cover transition-opacity duration-500"
                            />
                        </div>
                    </div>
                </div>


                <div className="mt-6 text-center rounded-2xl">
                    <a
                        href="#book"
                        className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-full" 
                        style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                        aria-label="Book a consultation to craft your financial peace"
                    >
                        <span className="font-semibold text-lg">Let’s Craft Your Financial P.E.A.C.E.</span>
                    </a>
                </div>
            </div>
        </section>
    )
}
