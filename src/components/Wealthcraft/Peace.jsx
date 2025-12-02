import React, { useState } from 'react'
import { COLORS } from '../../constants/colors'

const items = [
    { k: 'P', title: 'Planning for Life Situations', text: 'Comprehensive financial strategies designed for every stage — early career, mid-life, retirement, and legacy planning.' },
    { k: 'E', title: 'Educated Financial Choices', text: 'Empowering you with clear, data-backed insights so every decision feels informed — not impulsive.' },
    { k: 'A', title: 'Achieving Financial Goals', text: 'Helping you reach your life goals — home purchase, child education, financial independence, or early retirement.' },
    { k: 'C', title: 'Create Wealth Mindfully', text: 'Wealth creation that aligns with your values — not just numbers on a spreadsheet.' },
    { k: 'E', title: 'Emotional Support', text: 'Financial guidance during uncertain times — steady advice that keeps you calm and confident.' }
]

export default function Peace() {
    const [active, setActive] = useState(null)

    return (
        <section
            id="peace"
            className="py-10 relative overflow-hidden"
            style={{ background: `${COLORS.EMERALD_GREEN}12` }}
        >

            {/* === FLOATING GREEN CLOUDS BACKGROUND === */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
            </div>

            <div className="max-w-6xl mx-auto px-3">
                <div className="text-center">

                    <div className="text-sm font-medium text-emerald-700 mb-4 animate-fadeSlow">
                        Our Signature Approach
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
                        Financial <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-400">P.E.A.C.E. </span> of Mind!

                    </h2>
                    <p className="mt-3 mb-3 text-slate-600 max-w-2xl mx-auto animate-fadeSlow">
                        A simple, time-tested framework that brings structure and serenity to your financial life.
                    </p>
                    {/* PEACE LETTERS */}
                    <div
                        className="flex items-center justify-center gap-6 mb-8"
                        onMouseLeave={() => setActive(null)}
                    >
                        {items.map((it, i) => (
                            <button
                                key={i}
                                onMouseEnter={() => setActive(i)}
                                onFocus={() => setActive(i)}
                                className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold
                  transition-all duration-500 ease-out
                  hover:rotate-6 hover:shadow-xl
                  ${active === i
                                        ? 'scale-125 opacity-100 bg-white text-emerald-700 ring-4 ring-emerald-400 shadow-lg'
                                        : active !== null
                                            ? 'scale-75 opacity-30 bg-emerald-600 text-white'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }
                `}
                            >
                                {it.k}
                            </button>
                        ))}
                    </div>



                    {/* DETAIL PANEL (no reserved space when closed) */}
                    <div className="mt-8">
                        {active !== null && (
                            <div className="mx-auto max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-slideFade">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold shadow">
                                        {items[active].k}
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-slate-900">{items[active].title}</div>
                                        <div className="text-sm text-slate-600 mt-2">{items[active].text}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA BUTTON */}
                    <div className="mt-10">
                        <a
                            href="#craft"
                            className="inline-flex items-center px-7 py-3 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            style={{ backgroundColor: COLORS.EMERALD_GREEN }}
                        >
                            Let’s Craft Your Financial P.E.A.C.E.
                        </a>
                    </div>

                </div>
            </div>

            {/* === CSS ANIMATIONS === */}
            <style>{`
        .animate-fadeSlow {
          animation: fadeSlow 1.5s ease both;
        }
        @keyframes fadeSlow {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideFade {
          animation: slideFade .35s ease-out both;
        }
        @keyframes slideFade {
          from { opacity: 0; transform: translateY(14px) scale(.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

                /* FLOATING GREEN CLOUDS */
                .cloud {
                    position: absolute;
                    filter: blur(96px);
                    opacity: 0.45;
                    background: ${COLORS.EMERALD_GREEN};
                    border-radius: 50%;
                    animation: floatCloud 18s ease-in-out infinite alternate;
                }

        .cloud-1 {
          width: 420px;
          height: 320px;
          top: -80px;
          left: -60px;
          animation-duration: 22s;
        }

        .cloud-2 {
          width: 360px;
          height: 260px;
          bottom: -60px;
          right: -50px;
          animation-duration: 26s;
        }

        .cloud-3 {
          width: 280px;
          height: 200px;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          animation-duration: 30s;
        }

        @keyframes floatCloud {
          from { transform: translateY(0) translateX(0) scale(1); }
          to   { transform: translateY(-40px) translateX(20px) scale(1.1); }
        }
      `}</style>

        </section>
    )
}
