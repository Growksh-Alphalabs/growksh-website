import React, { useState, useEffect } from 'react'
import { COLORS } from '../../constants/colors'
import img1 from '../../assets/Website images/Wealthcraft - professional.png'
import img2 from '../../assets/Website images/Wealthcraft - women.png'
import img3 from '../../assets/Website images/Wealthcraft - NRI.png'

const cards = [
    {
        key: 'busy',
        title: 'Busy Working Professionals',
        img: img1,
        lines: [
            'You earn well but don\'t have time to organize, track, or optimize your finances. Money keeps coming in and going out — without clarity on where it\'s all heading.',
            'You want to grow into a High Net Worth Individual (HNI) with a strong investment portfolio, tax efficiency, and early financial freedom — all without sacrificing peace of mind.'
        ]
    },
    {
        key: 'women',
        title: 'Independent Women',
        img: img2,
        lines: [
            'You\'re financially independent but often feel uncertain about whether your decisions are right, safe, or strategic for the long term.',
            'You want to make your money work smarter — to build security, confidence, and financial freedom without depending on anyone.'
        ]
    },
    {
        key: 'nri',
        title: 'NRIs & Global Indians',
        img: img3,
        lines: [
            'You want to create, grow, and protect wealth in India while living abroad.',
            'Managing finances across borders feels complex — taxation, repatriation, investment rules, and currency exposure add layers of confusion.'
        ]
    }
]

export default function WhoWeServe() {
    const [hovered, setHovered] = useState(null)
    const [touchMode, setTouchMode] = useState(false)
    const [mobileView, setMobileView] = useState(false)

    // Detect touch devices and screen size
    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        setTouchMode(isTouchDevice)
        
        const checkMobile = () => {
            setMobileView(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleMouseEnter = (key) => {
        if (!touchMode && !mobileView) {
            setHovered(key)
        }
    }

    const handleMouseLeave = () => {
        if (!touchMode && !mobileView) {
            setHovered(null)
        }
    }

    const handleTouch = (key) => {
        if (touchMode || mobileView) {
            setHovered(prev => prev === key ? null : key)
        }
    }

    const isFlipped = (key) => {
        return hovered === key
    }

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="text-center mb-12">
                    <div className="text-sm font-medium text-[#ffde21] mb-4 tracking-wider uppercase">
                        People Who Choose Wealthcraft
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        Who We Work With
                    </h2>
                   
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    {cards.map((c) => (
                        <div
                            key={c.key}
                            className={`flip-card h-80 md:h-96 perspective-1000 ${!touchMode ? 'cursor-pointer' : ''}`}
                            onMouseEnter={() => handleMouseEnter(c.key)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleTouch(c.key)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleTouch(c.key);
                                }
                            }}
                        >
                            <div
                                className={`flip-card-inner relative w-full h-full transition-transform duration-500 ease-in-out preserve-3d ${
                                    isFlipped(c.key) ? 'rotate-y-180' : ''
                                }`}
                            >
                                {/* Front side */}
                                <div className="flip-card-front absolute inset-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-[#ffde21]/20 backface-hidden flex flex-col group">
                                    <div className="relative h-2/3 overflow-hidden">
                                        <img
                                            src={c.img}
                                            alt={c.title}
                                            className="w-full h-full object-cover transition-transform duration-700 transform group-hover:-translate-y-1"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        
                                       

                                        {/* Hover glow effect */}
                                        <div className={`absolute inset-0 bg-[#ffde21]/10 transition-opacity duration-500 ${
                                            isFlipped(c.key) ? 'opacity-0' : 'group-hover:opacity-100'
                                        }`} />
                                    </div>
                                    
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1 text-center group-hover:text-[#ffde21] transition-colors duration-300">
                                            {c.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 text-center">
                                            {touchMode || mobileView ? '' : ''}
                                        </p>
                                        
                                        {/* Animated arrow */}
                                        <div className="flex justify-center mt-4">
                                            <div className="relative w-12 h-2 bg-[#ffde21]/10 rounded-full overflow-hidden">
                                                <div className={`absolute inset-y-0 left-0 w-6 bg-[#ffde21]/40 rounded-full transition-all duration-500 transform ${
                                                        isFlipped(c.key) ? 'translate-x-6' : 'group-hover:translate-x-6'
                                                    }`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover text overlay */}
                                    <div className={`absolute inset-0 bg-[#ffde21]/90 flex items-center justify-center p-6 transition-all duration-500 rounded-2xl ${
                                        isFlipped(c.key) ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                                    }`}>
                                        <div className="text-center text-white">
                                            <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                            <p className="font-semibold">View Details</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Back side */}
                                <div className="flip-card-back absolute inset-0 bg-gradient-to-br from-[#ffde21]/10 to-white rounded-2xl shadow-2xl border border-[#ffde21]/20 backface-hidden rotate-y-180 p-4 overflow-y-auto">
                                    <div className="h-full flex flex-col">
                                        {/* Back header */}
                                        <div className="flex items-center justify-between mb-6">
                                            {/* <div className="w-10 h-10 rounded-full bg-[#ffde21]/10 flex items-center justify-center animate-pulse-slow">
                                                <span className="text-[#ffde21] font-bold">{c.key.charAt(0).toUpperCase()}</span>
                                            </div> */}
                                            <div className="text-xs text-[#ffde21] font-medium px-3 py-1 bg-[#ffde21]/10 rounded-full">
                                                {touchMode || mobileView ? '' : ''}
                                            </div>
                                        </div>
                                        
                                        {/* Back content */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-3 animate-slide-up">{c.title}</h3>
                                            
                                            <div className="space-y-4">
                                                {c.lines.map((line, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="flex gap-3 animate-slide-up"
                                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                                    >
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-2 h-2 rounded-full bg-[#ffde21]/40 animate-bounce" style={{ animationDelay: `${idx * 0.2}s` }}></div>
                                                        </div>
                                                        <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                                                            {line}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                
                .flip-card-front {
                    transform: rotateY(0deg);
                }
                
                .flip-card-back {
                    transform: rotateY(180deg);
                }
                
                .flip-card-inner {
                    transform-style: preserve-3d;
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* Enhanced hover effects - use translate for lift to avoid rasterizing text */
                .flip-card-inner {
                    will-change: transform;
                }

                .flip-card:hover .flip-card-inner:not(.rotate-y-180) {
                    transform: translateY(-6px);
                    transition-duration: 0.3s;
                }

                .flip-card:hover .flip-card-inner.rotate-y-180 {
                    transform: rotateY(180deg);
                    transition-duration: 0.5s;
                }

                /* Improve text rendering to avoid blurred appearance after transforms */
                .flip-card-front,
                .flip-card-back,
                .flip-card-front * ,
                .flip-card-back * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                }
                
                /* Animations */
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }
                
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .flip-card {
                        height: 300px;
                        margin-bottom: 0.75rem;
                    }
                    
                    .flip-card-inner {
                        transition-duration: 0.4s;
                    }
                    
                    /* Disable hover effects on mobile */
                    .flip-card:hover .flip-card-inner:not(.rotate-y-180) {
                        transform: none;
                    }
                    
                    .flip-card:hover .flip-card-inner.rotate-y-180 {
                        transform: rotateY(180deg);
                    }
                }
                
                /* Reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    .flip-card-inner,
                    .flip-card-front,
                    img,
                    .group-hover\:scale-110,
                    .animate-slide-up,
                    .animate-pulse-slow,
                    .animate-bounce {
                        transition: none !important;
                        animation: none !important;
                        transform: none !important;
                    }
                }
                
                /* Custom scrollbar */
                .flip-card-back::-webkit-scrollbar {
                    width: 4px;
                }
                
                .flip-card-back::-webkit-scrollbar-track {
                    background: rgba(255, 222, 33, 0.05);
                    border-radius: 10px;
                }
                
                .flip-card-back::-webkit-scrollbar-thumb {
                    background: rgba(255, 222, 33, 0.2);
                    border-radius: 10px;
                }
                
                .flip-card-back::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 222, 33, 0.3);
                }
            `}</style>
        </section>
    )
}