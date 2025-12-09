import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo1 from '../../assets/Website images/Growksh Logo 1.png'
import LogoWealth from '../../assets/Website images/Growksh Wealthcraft logo.png'
import LogoAlpha from '../../assets/Website images/Growksh Alphalabs logo.png'
import LogoVentures from '../../assets/Website images/Growksh Logo 2.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileAlphaOpen, setMobileAlphaOpen] = useState(false)
  const [mobileWealthOpen, setMobileWealthOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Navigate to a path that may include a hash, then scroll to the anchor if present.
  const handleAnchor = (to) => {
    if (!to) return
    const [pathPart, hashPart] = to.split('#')
    const targetId = hashPart

    // If we're already on the path, just scroll to the element.
    if (location.pathname === (pathPart || '/')) {
      if (targetId) {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          el.focus && el.focus()
          return
        }
        // fallback set hash
        window.location.hash = targetId
      } else {
        navigate(pathPart || '/')
      }
      return
    }

    // Navigate to the path first, then attempt to scroll after a short delay.
    navigate(pathPart || '/')
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          el.focus && el.focus()
        } else {
          // set the hash so browser can handle it on load
          window.location.hash = targetId
        }
      }, 120)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/wealthcraft', label: 'Advisory' },
    { to: '/alphalabs', label: 'Education' },
    { to: '/ventures', label: 'Asset Management' },
    { to: '/insights', label: 'Resources' }
  ]

  const alphalabsMenu = [
    { to: '/alphalabs#what-we-do', label: 'What we do' },
    { to: '/alphalabs#alpha-approach', label: 'Learning Model' },
    { to: '/alphalabs#programs', label: 'Programs' },
    { to: '/alphalabs#why-learn', label: 'Why learn' },
    { to: '/alphalabs#community', label: 'Community' }
  ]

  const wealthMenu = [
    { to: '/wealthcraft#peace', label: 'P.E.A.C.E.' },
    { to: '/wealthcraft#wealth-process', label: 'Wealth process' },
    { to: '/wealthcraft#wealthcraft-pricing', label: 'Pricing' }
  ]

  return (
    <header className="bg-white/95 fixed w-full z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          <div className="flex items-center gap-6">
            {/* Choose logo and link based on current route */}
            {(() => {
              const path = location.pathname || '/'

              let logoSrc = Logo1
              let logoAlt = 'Growksh'
              let logoLink = '/'

              if (path.startsWith('/wealthcraft')) {
                logoSrc = LogoWealth
                logoAlt = 'Growksh Wealthcraft'
                logoLink = '/wealthcraft'
              } else if (path.startsWith('/alphalabs')) {
                logoSrc = LogoAlpha
                logoAlt = 'Growksh Alphalabs'
                logoLink = '/alphalabs'
              } else if (path.startsWith('/ventures')) {
                logoSrc = LogoVentures
                logoAlt = 'Growksh Ventures'
                logoLink = '/ventures'
              }

              return (
                <Link to={logoLink} className="flex items-center gap-3 no-underline">
                  <img
                    src={logoSrc}
                    alt={`${logoAlt} logo`}
                    className="w-20 h-full sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-md object-contain"
                  />
                </Link>
              )
            })()}
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <div key={link.to} className="relative">
                {link.to === '/alphalabs' ? (
                  <div className="group">
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `relative px-3 py-2 text-base md:text-lg font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="relative z-10">{link.label}</span>
                          <span
                            aria-hidden
                            className={`absolute left-0 bottom-0 h-0.5 bg-sky-600 transform transition-transform duration-200 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                            style={{ width: '100%' }}
                          />
                        </>
                      )}
                    </NavLink>

                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-100 p-2 invisible group-hover:visible group-hover:opacity-100 opacity-0 transform translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-40">
                      {alphalabsMenu.map(item => (
                        <button key={item.to} onClick={() => handleAnchor(item.to)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">{item.label}</button>
                      ))}
                    </div>
                  </div>
                ) : link.to === '/wealthcraft' ? (
                  <div className="group">
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `relative px-3 py-2 text-base md:text-lg font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="relative z-10">{link.label}</span>
                          <span
                            aria-hidden
                            className={`absolute left-0 bottom-0 h-0.5 bg-sky-600 transform transition-transform duration-200 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                            style={{ width: '100%' }}
                          />
                        </>
                      )}
                    </NavLink>

                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-100 p-2 invisible group-hover:visible group-hover:opacity-100 opacity-0 transform translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-40">
                      {wealthMenu.map(item => (
                        <button key={item.to} onClick={() => handleAnchor(item.to)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">{item.label}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `relative px-3 py-2 text-base md:text-lg font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="relative z-10">{link.label}</span>
                        <span
                          aria-hidden
                          className={`absolute left-0 bottom-0 h-0.5 bg-sky-600 transform transition-transform duration-200 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                          style={{ width: '100%' }}
                        />
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full text-base md:text-lg shadow hover:opacity-95 transition">Contact</Link>

            <button
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label="Toggle navigation"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              {!open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
          <div className={`md:hidden transition-max-h duration-300 ease-in-out overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-6 bg-white/95 border-t border-slate-200">
          <div className="space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile submenus for Alphalabs + Wealthcraft (collapsible) */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                aria-expanded={mobileAlphaOpen}
                onClick={() => setMobileAlphaOpen(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 rounded-md hover:bg-slate-50"
              >
                <span>Education</span>
                <span className={`transform transition-transform ${mobileAlphaOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden>▾</span>
              </button>

              <div className={`${mobileAlphaOpen ? 'block' : 'hidden'} mt-1 space-y-1`}>
                {alphalabsMenu.map(item => (
                  <button
                    key={item.to}
                    onClick={() => { handleAnchor(item.to); setOpen(false); setMobileAlphaOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                aria-expanded={mobileWealthOpen}
                onClick={() => setMobileWealthOpen(v => !v)}
                className="mt-3 w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 rounded-md hover:bg-slate-50"
              >
                <span>Advisory</span>
                <span className={`transform transition-transform ${mobileWealthOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden>▾</span>
              </button>

              <div className={`${mobileWealthOpen ? 'block' : 'hidden'} mt-1 space-y-1`}>
                {wealthMenu.map(item => (
                  <button
                    key={item.to}
                    onClick={() => { handleAnchor(item.to); setOpen(false); setMobileWealthOpen(false) }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)} className="block text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full">Schedule a Call</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
