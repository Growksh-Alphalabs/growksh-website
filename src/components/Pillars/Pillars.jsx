import React, { useState } from 'react'
import iconWealth from '../../assets/Website images/Wealthcraft logo.png'
import iconVentures from '../../assets/Website images/Growksh Ventures Logo.png'
import iconAlpha from '../../assets/Website images/Growksh Alphalabs logo.png'
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
      className="relative min-h-[20rem] md:min-h-[28rem] cursor-pointer"
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
          <div className="absolute inset-0 bg-white/5"></div>

          <div className="absolute top-0 left-0 right-0 h-2 bg-[#3dc7f5]"></div>

          <div className="relative h-full p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>

            <p className="text-slate-600 font-medium mb-2 px-4 italic">{tagline}</p>

            <div className={`mt-4 ${imagePosition === 'center' ? 'mx-auto' : ''}`}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center shadow-inner" style={{ backgroundColor: 'rgba(61,199,245,0.06)' }}>
                <img src={iconSrc} alt={`${title} visual`} className="w-full h-full opacity-90 object-cover" />
              </div>
            </div>

            {/* Visible CTA on the front to indicate further content */}
            <div className="absolute bottom-6 right-6 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3dc7f5] text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3dc7f5] transition"
                aria-label={`Read more about ${title}`}
                title={`Read more about ${title}`}
              >
                <span>Read More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full p-8 flex flex-col">
            <div className="mb-6">
              <div className="h-1 w-12 bg-[#3dc7f5] rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="text-slate-600 leading-relaxed space-y-4">{children}</div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <Link
                to={href}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#3dc7f5] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
          {/* Solid, subtle background using the new theme colors (no gradients) */}
          <rect width="100%" height="100%" fill="#f0fbff" />

          {/* Main soft shapes — solid fills with low opacity, using palette colors */}
          <g opacity="0.38">
            <ellipse cx="15%" cy="25%" rx="450" ry="350" fill="#3dc7f5" fillOpacity="0.08" />
            <ellipse cx="85%" cy="65%" rx="400" ry="300" fill="#cf87bf" fillOpacity="0.06" />
            <circle cx="50%" cy="50%" r="350" fill="#3dc7f5" fillOpacity="0.06" />
            <ellipse cx="70%" cy="30%" rx="300" ry="250" fill="#2e3b4b" fillOpacity="0.04" />
            <ellipse cx="30%" cy="70%" rx="280" ry="220" fill="#3dc7f5" fillOpacity="0.05" />
          </g>

          {/* Floating wisps — solid color circles with low opacity */}
          <g opacity="0.22">
            <circle cx="10%" cy="10%" r="120" fill="#3dc7f5" fillOpacity="0.08" />
            <circle cx="90%" cy="20%" r="100" fill="#cf87bf" fillOpacity="0.06" />
            <circle cx="25%" cy="85%" r="150" fill="#3dc7f5" fillOpacity="0.05" />
            <circle cx="75%" cy="45%" r="80" fill="#2e3b4b" fillOpacity="0.04" />
            <circle cx="60%" cy="15%" r="70" fill="#3dc7f5" fillOpacity="0.05" />
            <circle cx="40%" cy="90%" r="90" fill="#cf87bf" fillOpacity="0.05" />
          </g>

          {/* Subtle accents */}
          <g opacity="0.14">
            <circle cx="5%" cy="40%" r="60" fill="#cf87bf" fillOpacity="0.03" />
            <circle cx="95%" cy="80%" r="50" fill="#3dc7f5" fillOpacity="0.03" />
            <circle cx="20%" cy="60%" r="40" fill="#2e3b4b" fillOpacity="0.02" />
            <circle cx="80%" cy="10%" r="35" fill="#3dc7f5" fillOpacity="0.02" />
            <ellipse cx="45%" cy="20%" rx="70" ry="50" fill="#cf87bf" fillOpacity="0.03" />
            <ellipse cx="55%" cy="75%" rx="60" ry="40" fill="#3dc7f5" fillOpacity="0.02" />
          </g>

          {/* Very subtle overlay as a solid tint */}
          <rect width="100%" height="100%" fill="#f8fdff" fillOpacity="0.06" />
        </svg>

        {/* Animated floating clouds */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#3dc7f5] opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-20 w-80 h-80 bg-[#cf87bf] opacity-10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-[#2e3b4b] opacity-6 rounded-full blur-2xl animate-pulse delay-500" />

        {/* Gradient fades */}
        <div className="absolute top-0 left-0 w-full h-40 bg-white/40"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-white/40"></div>
        <div className="absolute left-0 top-0 h-full w-32 bg-white/30"></div>
        <div className="absolute right-0 top-0 h-full w-32 bg-white/30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">


          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            How We <span className="text-[#cf87bf]">Help You!</span>
          </h2>

          <p className="text-lg text-slate-600">
            Three complementary pillars that work together to deliver financial clarity, execution,
            and learning — tailored for every stage of your wealth journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            iconSrc={iconAlpha}
            title="Education"
            tagline="The Financial Learning Studio"
            href="/alphalabs"
          >
            <>
              <p><b>An experiential learning & coaching space where finance becomes a life skill.</b></p>
              <p>It's built on the idea that alpha — true outperformance — comes from clarity and understanding.</p> <b/> Here, learning isn't about theory; it's about discovering practical ways to think, decide, and grow with your money.
            </>
          </Card>

          <Card
            iconSrc={iconWealth}
            title="Advisory "
            tagline="Your Trusted Financial Partner for Life!"
            href="/wealthcraft"
          >
            <>
              <p><b>Fee-based advisory and life-aligned financial planning for working professionals, women, and NRIs.</b></p>
              <p>We help you achieve Financial P.E.A.C.E. of Mind — so you know your finances are aligned with your goals and values, today and for years to come.</p>
            </>
          </Card>

          <Card
            iconSrc={iconVentures}
            title="Asset Management"
            tagline="Where Wealth Finds Direction"
            href="/ventures"
          >
            <>
              <p><b>Execution and wealth-management arm of Growksh — focused on implementing smart, transparent, and goal-based financial solutions.</b></p>
              <p>Growksh Ventures is designed for individuals who want their investments, insurance, and portfolios handled with strategy and structure.</p>
            </>
          </Card>


        </div>
      </div>
    </section>
  )
}