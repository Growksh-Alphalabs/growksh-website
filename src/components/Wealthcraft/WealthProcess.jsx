import React, { useState, useEffect } from 'react'
import { COLORS } from '../../constants/colors'
import defaultPeace from '../../assets/Website images/Wealthcraft - WEALTH process.png'
import imgW from '../../assets/Website images/Wealthcraft - Wealth process - W.png'
import imgE from '../../assets/Website images/Wealthcraft - Wealth process - E.png'
import imgA from '../../assets/Website images/Wealthcraft - Wealth process - A.png'
import imgL from '../../assets/Website images/Wealthcraft - Wealth process - L.png'
import imgT from '../../assets/Website images/Wealthcraft - Wealth process - T.png'
import imgH from '../../assets/Website images/Wealthcraft - Wealth process - H.png'
import { Link } from 'react-router-dom'

const steps = [
    {
        short: 'W',
        title: 'Welcome & Understand',
        paragraphs: [
            'We start with a deep discovery conversation to understand your story, life goals, values, and financial reality. This is where we get to know you — not just your numbers.',
            'We uncover what truly matters — whether it’s early retirement, child education, or simply peace of mind.'
        ]
    },
    {
        short: 'E',
        title: 'Examine & Analyze',
        paragraphs: [
            'Next, we dive into your current financial landscape — income, expenses, assets, liabilities, insurance, and taxation.',
            'Our detailed analysis highlights what’s working, what’s missing, and how your money can perform better. This is where we turn information into insight.'
        ]
    },
    {
        short: 'A',
        title: 'Architect the Strategy',
        paragraphs: [
            'Based on the diagnosis, we design a comprehensive, goal-based financial plan — tax-efficient, practical and aligned to your life stage.',
            'You receive a clear, actionable roadmap that helps you achieve your financial goals.'
        ]
    },
    {
        short: 'L',
        title: 'Learn Along the Way',
        paragraphs: [
            'We believe clarity creates confidence. That’s why education is built into our process — not as theory, but as empowerment.',
            'We host exclusive learning sessions for our clients on practical money topics — investments, tax planning, insurance, behavioral finance, and more — so you stay informed while your money grows.',
            'Our goal is to help you become not just wealthy, but financially wise.'
        ]
    },
    {
        short: 'T',
        title: 'Take Action (Implementation)',
        paragraphs: [
            'Goal achievement comes from doing, not just planning.',
            'We guide you through the implementation process — step by step — helping you take timely and informed action on your plan.',
            'Whether it’s setting up your investment portfolio, insurance cover, or optimizing taxes, we stay by your side with unbiased support. Execution is always your choice; we ensure you have the clarity and confidence to act right.'
        ]
    },
    {
        short: 'H',
        title: 'Hold & Review',
        paragraphs: [
            'Life is dynamic — and so should be your financial plan.',
            'As your priorities evolve, so do your strategies.',
            'We conduct structured review sessions to monitor your progress, adjust your plan for life changes (new goals, career moves, markets, or family milestones), rebalance portfolios and ensure your money always works in alignment with your life.',
            'You’ll never feel lost or “off track” again — because we stay with you, year after year.'
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
                    Our 6-Step Advisory Framework
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white text-center">
                    The <span className="text-[#ffde21]">W.E.A.L.T.H. </span> PROCESS™

                </h2>
                <p className="mt-3 mb-3 text-slate-300 max-w-xl mx-auto animate-fadeSlow text-center">
                    A structured, experience-driven process that turns financial confusion into clarity — and keeps you supported at every stage of your journey.
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
                                src={active === null ? defaultPeace : [imgW, imgE, imgA, imgL, imgT, imgH][active]}
                                alt={`Wealthcraft ${active === null ? 'Wealth' : steps[active].short}`}
                                className="w-full h-64 sm:h-72 object-cover transition-opacity duration-500"
                            />
                        </div>
                    </div>
                </div>

                <p className="mt-3 mb-3 text-slate-300 max-w-xl mx-auto animate-fadeSlow text-center">
                    Ready for a financial plan that evolves with your life?
                </p>
                <div className="mt-6 text-center rounded-2xl">
                    <Link
                        to="#book"
                        className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-full"
                        style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                        aria-label="Book Your Discovery Call"
                    >
                        <span className="font-semibold text-lg">Book Your Discovery Call</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

