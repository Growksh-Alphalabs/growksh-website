import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo1 from '../../assets/Website images/Growksh Logo 1.png'
import LogoWealth from '../../assets/Website images/Wealthcraft logo.png'
import LogoAlpha from '../../assets/Website images/Growksh Alphalabs logo.png'
import LogoVentures from '../../assets/Website images/Growksh Ventures Logo.png'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileAlphaOpen, setMobileAlphaOpen] = useState(false)
  const [mobileWealthOpen, setMobileWealthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    setProfileOpen(false)
  }, [location.pathname])

  const displayName = (user && (user.name || user.email)) || ''
  const displayEmail = (user && user.email) || ''
  const avatarText = (displayName || displayEmail || 'U').trim().charAt(0).toUpperCase()

  const handleLogout = async () => {
    const ok = window.confirm('Logout now?')
    if (!ok) {
      setProfileOpen(false)
      setOpen(false)
      return
    }
    try {
      await logout()
    } finally {
      setProfileOpen(false)
      setOpen(false)
      navigate('/')
    }
  }

  // Keep a CSS variable updated with the header height + offset so
  // native scrolling (and `scroll-margin-top`) positions anchors correctly.
  useEffect(() => {
    const offset = 12
    const header = () => document.querySelector('header')

    const setVar = () => {
      const h = header() ? header().getBoundingClientRect().height : 80
      document.documentElement.style.setProperty('--scroll-anchor-offset', `${h + offset}px`)
    }

    setVar()

    let ro
    try {
      ro = new ResizeObserver(setVar)
      if (header()) ro.observe(header())
    } catch (e) {}

    window.addEventListener('resize', setVar)
    window.addEventListener('load', setVar)
    return () => {
      try { ro && ro.disconnect() } catch (e) {}
      window.removeEventListener('resize', setVar)
      window.removeEventListener('load', setVar)
    }
  }, [])

  // Navigate to a path that may include a hash, then scroll to the anchor if present.
  async function handleAnchor(to) {
    if (!to) return
    const [pathPart, hashPart] = to.split('#')
    const targetId = hashPart

    const waitForElement = (id, timeout = 2000) => new Promise((resolve) => {
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

      // Apply a scroll-margin so native scrolling and scrollIntoView
      // will position the element below the fixed header.
      try {
        el.style.scrollMarginTop = `${headerHeight + offset}px`
      } catch (e) {}

      // Prefer native scrollIntoView (respects scroll-margin-top).
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch (e) {
        // Fallback to manual scroll calculation.
        const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerHeight - offset)
        window.scrollTo({ top, behavior: 'smooth' })
      }

      // Secondary correction: some layouts (sticky children, fonts/images)
      // can shift after the initial scroll. Recompute and snap after a short delay.
      try {
        setTimeout(() => {
          const top2 = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerHeight - offset)
          window.scrollTo({ top: top2, behavior: 'auto' })
        }, 150)
      } catch (e) {}

      try {
        el.setAttribute('tabindex', '-1')
        el.focus()
      } catch (e) {}
    }

    // If already on the target path, wait briefly for element and scroll.
    if (location.pathname === (pathPart || '/')) {
      if (targetId) {
        const el = await waitForElement(targetId)
        if (el) {
          // Delay slightly to ensure layout (images/fonts) settles before scrolling.
          setTimeout(() => {
            try {
              requestAnimationFrame(() => scrollToEl(el))
            } catch (e) {
              scrollToEl(el)
            }
          }, 80)
          return
        }
        // fallback: set hash so browser can handle it
        window.location.hash = targetId
      } else {
        navigate(pathPart || '/')
      }
      return
    }

    // Navigate to the path first, then wait for the element to exist and scroll to it.
    navigate(pathPart || '/')
    if (targetId) {
      const el = await waitForElement(targetId)
      if (el) {
        // small delay to ensure layout settled before scrolling
        setTimeout(() => {
          try {
            requestAnimationFrame(() => scrollToEl(el))
          } catch (e) {
            scrollToEl(el)
          }
        }, 80)
      } else {
        // fallback: set hash so browser can handle it on load
        window.location.hash = targetId
      }
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
                      ? 'w-16 h-16 p-0 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded-md object-contain'
                      : 'w-14 h-14 p-2 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-md object-contain'
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
            <Link to="/contact" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-violet-600 text-white rounded-full text-base md:text-lg shadow hover:opacity-95 transition">Contact</Link>
            {(() => {
              const useOidc = !!import.meta.env.VITE_COGNITO_AUTHORITY
              const onAuthClick = (e) => {
                if (useOidc) {
                  // still dispatch oidc-signin, but allow the Link navigation to occur
                  window.dispatchEvent(new CustomEvent('oidc-signin'))
                }
              }

              return (
                <>
                  {!isAuthenticated && (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={onAuthClick}
                        className="hidden md:inline-flex items-center justify-center px-5 py-2 bg-[#00674F] text-white rounded-full text-sm font-semibold hover:bg-[#004d39] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00674F]/30"
                      >
                        Login
                      </Link>
                    </>
                  )}

                  {isAuthenticated && (
                    <div className="hidden md:block relative">
                      <button
                        type="button"
                        onClick={() => setProfileOpen(v => !v)}
                        aria-expanded={profileOpen}
                        className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {avatarText}
                        </span>
                        <span className="max-w-40 truncate text-sm text-slate-700">
                          {displayName || displayEmail}
                        </span>
                        <span className="text-slate-500" aria-hidden>▾</span>
                      </button>

                      <div className={`${profileOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-100 p-2 z-50`}>
                        <div className="px-3 py-2">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="text-sm font-medium text-slate-800 truncate">{displayName || displayEmail}</p>
                          {displayEmail && displayName && displayName !== displayEmail && (
                            <p className="text-xs text-slate-600 truncate">{displayEmail}</p>
                          )}
                        </div>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )
            })()}

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
                    <div className="flex items-center justify-between">
                      <Link to="/alphalabs" onClick={() => { setOpen(false); setMobileAlphaOpen(false) }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                        {link.label}
                      </Link>
                      <button onClick={() => setMobileAlphaOpen(v => !v)} aria-expanded={mobileAlphaOpen} className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-50">
                        <span className={`transform transition-transform ${mobileAlphaOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden>▾</span>
                      </button>
                    </div>

                    <div id="submenu-alphalabs" className={`${mobileAlphaOpen ? 'block' : 'hidden'} mt-1 space-y-1`} role="region" aria-label="Alphalabs submenu"> 
                      {alphalabsMenu.map(item => (
                        <button
                          key={item.to}
                          onClick={() => { handleAnchor(item.to); setOpen(false); setMobileAlphaOpen(false) }}
                          className="w-full text-left pl-6 pr-3 py-2 rounded-md text-sm text-slate-700 bg-white border-l-4 border-transparent hover:bg-slate-50 hover:border-slate-200 transition"
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
                    <div className="flex items-center justify-between">
                      <Link to="/wealthcraft" onClick={() => { setOpen(false); setMobileWealthOpen(false) }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                        {link.label}
                      </Link>
                      <button onClick={() => setMobileWealthOpen(v => !v)} aria-expanded={mobileWealthOpen} className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-50">
                        <span className={`transform transition-transform ${mobileWealthOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden>▾</span>
                      </button>
                    </div>

                    <div id="submenu-wealth" className={`${mobileWealthOpen ? 'block' : 'hidden'} mt-1 space-y-1`} role="region" aria-label="Wealthcraft submenu"> 
                      {wealthMenu.map(item => (
                        <button
                          key={item.to}
                          onClick={() => { handleAnchor(item.to); setOpen(false); setMobileWealthOpen(false) }}
                          className="w-full text-left pl-6 pr-3 py-2 rounded-md text-sm text-slate-700 bg-white border-l-4 border-transparent hover:bg-slate-50 hover:border-slate-200 transition"
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
              <Link to="/contact" onClick={() => setOpen(false)} className="block text-center px-4 py-2 bg-linear-to-r from-purple-600 to-violet-600 text-white rounded-full">Schedule a Call</Link>
            </div>
            <div className="mt-3 space-y-2">
              {(() => {
                const useOidc = !!import.meta.env.VITE_COGNITO_AUTHORITY
                const onAuthClick = (e) => {
                  if (useOidc) {
                    window.dispatchEvent(new CustomEvent('oidc-signin'))
                  }
                  setOpen(false)
                }

                return (
                  <>
                    {!isAuthenticated && (
                      <Link
                        to="/auth/login"
                        onClick={onAuthClick}
                        className="block text-center w-full px-4 py-2 bg-[#00674F] text-white rounded-full font-semibold hover:bg-[#004d39] transition"
                      >
                        Login
                      </Link>
                    )}

                    {isAuthenticated && (
                      <div className="space-y-2">
                        <div className="px-4 py-3 bg-slate-50 rounded-md border border-slate-100">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="text-sm font-medium text-slate-800 truncate">{displayName || displayEmail}</p>
                          {displayEmail && displayName && displayName !== displayEmail && (
                            <p className="text-xs text-slate-600 truncate">{displayEmail}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="block text-center w-full px-4 py-2 border rounded-md font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
