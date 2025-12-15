import React from 'react'
import { COLORS } from '../../constants/colors'
import heroImg from '../../assets/Website images/Wealthcraft - hero section.png'
import wealthcraftLogo from '../../assets/Website images/Wealthcraft logo1.png'
import { Link } from 'react-router-dom'

export default function Hero() {
  const bgStyle = {
    backgroundImage: `url(${heroImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '85vh',
  }
  return (
    <section className="relative overflow-hidden w-full z-10" style={bgStyle}>
      {/* Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/45 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="w-full lg:absolute lg:top-1/2 lg:left-12 lg:-translate-y-1/2 lg:max-w-3xl z-20">
            {/* Blurred translucent panel behind text for legibility */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/10 max-w-3xl">
              <div className="inline-flex items-center px-5 py-3 rounded-full text-base font-medium text-black bg-yellow-400/95 ring-1 ring-yellow-400/50 mb-4">
                <img src={wealthcraftLogo} alt="Wealthcraft" className="w-8 h-8 mr-3 object-contain" />
                <span className="leading-none">Wealthcraft by Growksh</span>
              </div>

              <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight text-white">
                Your Trusted <span className="text-[#ffde21]">Financial Partner</span> for Life!
              </h2>

              <p className="mt-6 text-xl text-white/90">
                Growksh Wealthcraft helps you build <b>Financial P.E.A.C.E. of Mind</b> — with structured, unbiased, and purpose-driven financial planning designed around your life.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={async () => {
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

                      // load widget script and try again to create inline popup
                      await loadCalendlyScript()
                      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                        window.Calendly.initPopupWidget({ url: base })
                        return
                      }

                      // fallback: open in new tab
                      window.open(base, '_blank', 'noopener,noreferrer')
                    } catch (e) {
                      console.warn('Calendly open failed', e)
                      window.open(base, '_blank', 'noopener,noreferrer')
                    }
                  }}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-150"
                  style={{ backgroundColor: COLORS.YELLOW, color: '#000' }}
                >
                  Book a Discovery Call
                </button>

                <a
                  href="/wealthcraft#wealth-process"
                  onClick={async (e) => {
                    e.preventDefault()
                    const to = '/wealthcraft#wealth-process'
                    const [pathPart, hashPart] = to.split('#')
                    const targetId = hashPart
                    const startPath = pathPart || '/'
                    const waitForElement = (id, timeout = 2500) => new Promise((resolve) => {
                      const start = Date.now()
                      const tick = () => {
                        const el = document.getElementById(id)
                        if (el) return resolve(el)
                        if (Date.now() - start > timeout) return resolve(null)
                        setTimeout(tick, 50)
                      }
                      tick()
                    })

                    const scrollToEl = (el) => {
                      const header = document.querySelector('header')
                      const headerHeight = header ? header.getBoundingClientRect().height : 80
                      const offset = 12
                      try { el.style.scrollMarginTop = `${headerHeight + offset}px` } catch (e) {}
                      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (e) {
                        const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerHeight - offset)
                        window.scrollTo({ top, behavior: 'smooth' })
                      }
                      try { el.setAttribute('tabindex', '-1'); el.focus() } catch (e) {}

                      // final snap after layout settles
                      setTimeout(() => {
                        const top2 = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerHeight - offset)
                        window.scrollTo({ top: top2, behavior: 'auto' })
                      }, 150)
                    }

                    // perform navigation then scroll
                    try {
                      // use router navigate by importing the hook and calling it
                      const { useNavigate } = await import('react-router-dom')
                      const nav = useNavigate()
                      nav(startPath)
                    } catch (e) {
                      // fallback to history push
                      window.history.pushState({}, '', startPath)
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }

                    if (targetId) {
                      const el = await waitForElement(targetId)
                      if (el) {
                        setTimeout(() => requestAnimationFrame(() => scrollToEl(el)), 80)
                      } else {
                        window.location.hash = targetId
                      }
                    }
                  }}
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full font-medium text-base border border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-150"
                >
                  Know How It Works
                </a>
              </div>
            </div>
          </div>

          {/* Right column intentionally left empty — hero image is used as full-bleed background */}
          <div className="lg:w-1/2" aria-hidden />
        </div>
      </div>
    </section>
  )
}