import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <div className="text-sm text-slate-300">
              <span className="font-medium text-white">SEBI Registration No.:</span> <span className="ml-1">[insert number]</span>
              <div className="text-xs text-slate-400 mt-1">Valid till: [insert date]</div>
            </div>

            <p className="text-sm text-slate-300">
              Growksh Wealthcraft LLP is a SEBI Registered Investment Adviser. Advisory services are offered under Krutika Kathal’s individual RIA license.
            </p>

            <p className="text-xs text-slate-500 mt-2">Registered office: Baner, Pune, Maharashtra</p>
          </div>

          <div className="flex justify-start md:justify-center">
            <nav aria-label="Quick links" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link to="/about" className="text-sm text-slate-300 hover:text-white transition">About</Link>
              <Link to="/wealthcraft" className="text-sm text-slate-300 hover:text-white transition">Wealthcraft</Link>
              <Link to="/alphalabs" className="text-sm text-slate-300 hover:text-white transition">Alphalabs</Link>
              <Link to="/ventures" className="text-sm text-slate-300 hover:text-white transition">Ventures</Link>
              <Link to="/insights" className="text-sm text-slate-300 hover:text-white transition">Insights</Link>
              <Link to="/contact" className="text-sm text-slate-300 hover:text-white transition">Contact</Link>
            </nav>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center space-x-3">
              <Link to="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-300 hover:text-white transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24V7h5v17H0zM8 7h4.8v2.3h.1c.7-1.2 2.4-2.3 4.9-2.3C23 7 24 9.5 24 14.2V24h-5v-8.6c0-2-.1-4.6-2.8-4.6-2.8 0-3.2 2.1-3.2 4.4V24H8z" />
                </svg>
              </Link>

              <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-white transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" strokeWidth="1.5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="0.5" />
                </svg>
              </Link>

              <Link to="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-300 hover:text-white transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1C16.7 2 12 2 12 2h-.1s-4.7 0-8.5.8c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8 0 9.8v2.4C0 14 0.5 15.8.5 15.8s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1 1.7.3 7.4.8 7.4.8s4.7 0 8.5-.8c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.4.8-2.4s.5-1.8.5-3.6v-2.4c0-1.8-.5-3.6-.5-3.6zM9.8 15.5V8.3l6.2 3.6-6.2 3.6z" />
                </svg>
              </Link>
            </div>

            <div className="text-sm text-slate-500">Copyright © Growksh 2025</div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <Link to="/legal" className="hover:text-white transition mr-4">Legal</Link>
              <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            </div>
            <div>Investment advisory services are offered subject to the terms and conditions on this website.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
