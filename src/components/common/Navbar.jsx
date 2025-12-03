import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo1 from '../../assets/Website images/Growksh Logo 1.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/wealthcraft', label: 'Wealthcraft' },
    { to: '/alphalabs', label: 'Alphalabs' },
    { to: '/ventures', label: 'Ventures' },
    { to: '/insights', label: 'Insights' }
  ]

  return (
    <header className="bg-white/95 fixed w-full z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img src={Logo1} alt="Growksh logo" className="w-35 h-35 rounded-md object-contain" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`
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
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full text-sm shadow hover:opacity-95 transition">Contact</Link>

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

            <div className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)} className="block text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full">Schedule a Call</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
