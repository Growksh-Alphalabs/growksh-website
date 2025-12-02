import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

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
    <header className="bg-slate-900/90 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-sky-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold">G</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:inline">Growksh</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    <span
                      aria-hidden
                      className={`absolute left-0 bottom-0 h-0.5 bg-sky-400 transform transition-transform duration-200 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
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
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:bg-slate-800/50"
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
        <div className="px-4 pt-4 pb-6 bg-slate-900/95 border-t border-slate-800">
          <div className="space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}`}
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
