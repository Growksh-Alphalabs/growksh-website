import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo1 from '../../assets/Website images/Growksh Logo 1.png'
import LogoWealth from '../../assets/Website images/Wealthcraft logo.png'
import LogoAlpha from '../../assets/Website images/Growksh Alphalabs logo.png'
import LogoVentures from '../../assets/Website images/Growksh Ventures Logo.png'

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
    { to: '/alphalabs#alpha-approach', label: 'A.L.P.H.A. Learning Model' },
    { to: '/alphalabs#programs', label: 'Explore Programs' },
    { to: '/alphalabs#community', label: 'The Alpha Circle' }
  ]

  const wealthMenu = [
    { to: '/wealthcraft#peace', label: 'Financial P.E.A.C.E. Philosophy' },
    { to: '/wealthcraft#wealth-process', label: 'The W.E.A.L.T.H. Process' },
    { to: '/wealthcraft#wealthcraft-pricing', label: 'Pricing & Service Models' }
  ]

  return (
    <header className="bg-white fixed w-full z-50 shadow">
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
                  {(() => {
                    const isDefaultLogo = logoSrc === Logo1
                    const logoClass = isDefaultLogo
                      ? 'p-0 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded-md object-contain'
                      : 'p-2 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-md object-contain'
                    return (
                      <img
                        src={logoSrc}
                        alt={`${logoAlt} logo`}
                        className={logoClass}
                      />
                    )
                  })()}
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
          <div className={`md:hidden ${open ? 'block' : 'hidden'} transition-opacity duration-200 ease-in-out`} aria-hidden={!open}>
        <div className="px-4 pt-4 pb-6 bg-white/95 border-t border-slate-200">
          <div className="space-y-2">
            {navLinks.map(link => {
              if (link.to === '/alphalabs') {
                return (
                  <div key={link.to}>
                    <button onClick={() => setMobileAlphaOpen(v => !v)} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                      <span>{link.label}</span>
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
                  </div>
                )
              }

              if (link.to === '/wealthcraft') {
                return (
                  <div key={link.to}>
                    <button onClick={() => setMobileWealthOpen(v => !v)} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                      <span>{link.label}</span>
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
                )
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {link.label}
                </NavLink>
              )
            })}

            <div className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)} className="block text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full">Schedule a Call</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
