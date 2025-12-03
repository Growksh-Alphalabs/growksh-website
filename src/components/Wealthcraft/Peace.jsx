import React, { useState, useEffect } from 'react'

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
        <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-sm font-medium text-emerald-700 mb-4 tracking-wider text-center uppercase">
                        Our Signature Approach
                    </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 text-center">
                    Financial <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-400">P.E.A.C.E. </span> of Mind!

                </h2>
                <p className="mt-3 mb-3 text-slate-600 max-w-xl mx-auto animate-fadeSlow text-center">
                    A simple, time-tested framework that brings structure and serenity to your financial life.
                </p>

                {/* Accordion (wider) */}
                <div className="mt-6 mx-auto w-full max-w-6xl space-y-3">
                    {steps.map((s, i) => (
                        <div key={s.short + i} className="bg-white rounded-xl shadow-sm border border-emerald-50 overflow-hidden">
                            <button
                                type="button"
                                aria-expanded={active === i}
                                aria-controls={`wealth-panel-${i}`}
                                onClick={() => setActive(prev => prev === i ? null : i)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(prev => prev === i ? null : i) } }}
                                className="w-full text-left px-3 md:px-4 py-3 md:py-3 flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold text-sm">{s.short}</div>
                                    <div>
                                        <div className="font-semibold text-sm md:text-base text-slate-900">{s.title}</div>
                                    </div>
                                </div>
                                <div className={`transition-transform ${active === i ? 'rotate-180' : 'rotate-0'}`}>
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div
                                id={`wealth-panel-${i}`}
                                className={`px-3 md:px-4 pb-3 transition-[max-height,opacity,padding] ${reduceMotion ? '' : 'duration-300 ease-in-out'}`}
                                style={{ maxHeight: active === i ? '800px' : '0px', opacity: active === i ? 1 : 0, paddingTop: active === i ? '0.25rem' : 0 }}
                            >
                                <div className="text-sm text-slate-700 space-y-2">
                                    {s.paragraphs.map((p, idx) => (
                                        <p key={idx} className="leading-snug">{p}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="mt-6 text-center">
                    <a href="#book" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold">Let’s Craft Your Financial P.E.A.C.E.</a>
                </div>
            </div>
        </section>
    )
}
