import React, { useState } from 'react'
import iconWealth from '../../assets/Website images/Wealthcraft logo.png'
import iconVentures from '../../assets/Website images/Ventures Logo.png'
import iconAlpha from '../../assets/Website images/Alphalabs logo.png'
import { Link } from 'react-router-dom'

function Card({ iconSrc, title, tagline, children, href, imagePosition = 'center' }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMove(e) {
    if (!isFlipped) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotateY = (x - 0.5) * 10
    const rotateX = (0.5 - y) * 10

    setTilt({ x: rotateX, y: rotateY })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  const transformStyle = isFlipped
    ? {
      transform: `perspective(1000px) rotateY(${180 + tilt.y}deg) rotateX(${tilt.x}deg)`,
      transition: 'transform 600ms cubic-bezier(.22,.9,.32,1)',
    }
    : {
      transform: `perspective(1000px) rotateY(0deg)`,
      transition: 'transform 600ms cubic-bezier(.22,.9,.32,1)',
    }

  return (
    <div
      className="relative min-h-[28rem] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => {
        setIsFlipped(false)
        handleMouseLeave()
      }}
      onMouseMove={handleMove}
      tabIndex={0}
    >
      {/* 3D container */}
      <div
        className="absolute inset-0 transform-3d"
        style={transformStyle}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden [backface-visibility:hidden]">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/40 to-white"></div>

          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500"></div>

          <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>

            <p className="text-slate-600 font-medium mb-8 px-4 italic">{tagline}</p>

            <div className={`mt-4 ${imagePosition === 'center' ? 'mx-auto' : ''}`}>
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center shadow-inner">
                <img src={iconSrc} alt={`${title} visual`} className="w-28 h-28 opacity-90 object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full p-8 flex flex-col">
            <div className="mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-slate-600 leading-relaxed">{children}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <Link
                to={href}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Explore {title}</span>
                <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Pillars() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Enhanced purple smoky/cloudy background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            {/* Base gradient */}
            <linearGradient id="cloudBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#faf5ff" stopOpacity="1" />
              <stop offset="30%" stopColor="#f3e8ff" stopOpacity="1" />
              <stop offset="70%" stopColor="#e9d5ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#faf5ff" stopOpacity="1" />
            </linearGradient>

            {/* Cloud gradients */}
            <radialGradient id="cloud1" cx="15%" cy="25%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.04" />
            </radialGradient>

            <radialGradient id="cloud2" cx="85%" cy="65%" r="45%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.02" />
            </radialGradient>

            <radialGradient id="cloud3" cx="50%" cy="50%" r="40%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.14" />
              <stop offset="70%" stopColor="#d8b4fe" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="cloud4" cx="70%" cy="30%" r="35%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.12" />
              <stop offset="80%" stopColor="#e9d5ff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#faf5ff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="cloud5" cx="30%" cy="70%" r="30%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.10" />
              <stop offset="90%" stopColor="#a78bfa" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0" />
            </radialGradient>

            {/* Blur filters */}
            <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.9 0 0 0  0 0 1 0 0  0 0 0 0.85 0" />
            </filter>

            <filter id="softCloudBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="40" />
            </filter>

            <filter id="lightCloudBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>

          {/* Base gradient */}
          <rect width="100%" height="100%" fill="url(#cloudBase)" />

          {/* Main clouds - heavily blurred (lightened) */}
          <g filter="url(#cloudBlur)" opacity="0.45">
            <ellipse cx="15%" cy="25%" rx="450" ry="350" fill="url(#cloud1)" />
            <ellipse cx="85%" cy="65%" rx="400" ry="300" fill="url(#cloud2)" />
            <circle cx="50%" cy="50%" r="350" fill="url(#cloud3)" />
            <ellipse cx="70%" cy="30%" rx="300" ry="250" fill="url(#cloud4)" />
            <ellipse cx="30%" cy="70%" rx="280" ry="220" fill="url(#cloud5)" />
          </g>

          {/* Floating cloud wisps (lightened) */}
          <g opacity="0.22" filter="url(#softCloudBlur)">
            <circle cx="10%" cy="10%" r="120" fill="#8b5cf6" fillOpacity="0.12" />
            <circle cx="90%" cy="20%" r="100" fill="#7c3aed" fillOpacity="0.10" />
            <circle cx="25%" cy="85%" r="150" fill="#a855f7" fillOpacity="0.08" />
            <circle cx="75%" cy="45%" r="80" fill="#c084fc" fillOpacity="0.06" />
            <circle cx="60%" cy="15%" r="70" fill="#8b5cf6" fillOpacity="0.07" />
            <circle cx="40%" cy="90%" r="90" fill="#7c3aed" fillOpacity="0.09" />
          </g>

          {/* Subtle cloud accents (lightened) */}
          <g opacity="0.18" filter="url(#lightCloudBlur)">
            <circle cx="5%" cy="40%" r="60" fill="#a855f7" fillOpacity="0.05" />
            <circle cx="95%" cy="80%" r="50" fill="#8b5cf6" fillOpacity="0.04" />
            <circle cx="20%" cy="60%" r="40" fill="#c084fc" fillOpacity="0.03" />
            <circle cx="80%" cy="10%" r="35" fill="#7c3aed" fillOpacity="0.03" />
            <ellipse cx="45%" cy="20%" rx="70" ry="50" fill="#a855f7" fillOpacity="0.04" />
            <ellipse cx="55%" cy="75%" rx="60" ry="40" fill="#8b5cf6" fillOpacity="0.03" />
          </g>

          {/* Very subtle overlay */}
          <rect width="100%" height="100%" fill="url(#cloudBase)" fillOpacity="0.08" />
        </svg>

        {/* Animated floating clouds */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-br from-purple-200/12 to-violet-100/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-20 w-80 h-80 bg-gradient-to-tr from-violet-300/10 to-purple-100/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-gradient-to-r from-purple-600/6 to-pink-100/6 rounded-full blur-2xl animate-pulse delay-500" />

        {/* Gradient fades */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent opacity-40"></div>
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent opacity-30"></div>
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">


          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Help You!</span>
          </h2>

          <p className="text-lg text-slate-600">
            Three complementary pillars that work together to deliver financial clarity, execution,
            and learning — tailored for every stage of your wealth journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            iconSrc={iconAlpha}
            title="Growksh Alphalabs"
            tagline="The Financial Learning Studio"
            href="/alphalabs"
          >
            <b>An experiential learning & coaching space where finance becomes a life skill. </b><br/>It's built on the
            idea that alpha — true outperformance — comes from clarity and understanding. Here, learning isn't
            about theory; it's about discovering practical ways to think, decide, and grow with your money.
          </Card>

          <Card
            iconSrc={iconWealth}
            title="Growksh Wealthcraft"
            tagline="Your Trusted Financial Partner for Life!"
            href="/wealthcraft"
          >
            <b>Fee-based advisory and life-aligned financial planning for working professionals, women, and NRIs.</b>
            <br/>We help you achieve Financial P.E.A.C.E. of Mind — so you know your finances are aligned with
            your goals and values, today and for years to come.
          </Card>

          <Card
            iconSrc={iconVentures}
            title="Growksh Ventures"
            tagline="Where Wealth Finds Direction"
            href="/ventures"
          >
            <b>Execution and wealth-management arm of Growksh — focused on implementing smart, transparent,
            and goal-based financial solutions. </b><br/>Growksh Ventures is designed for individuals who want their
            investments, insurance, and portfolios handled with strategy and structure.
          </Card>


        </div>
      </div>
    </section>
  )
}