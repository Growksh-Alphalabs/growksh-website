import React from 'react'
import { Link } from 'react-router-dom'
import { FaLinkedin, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <div className="text-sm text-slate-300">
              <div>
                <span className="font-medium text-white">SEBI Registration No.:</span>
                <span className="ml-1">INA000020280</span>
              </div>
              <div className="mt-1">
                <span className="font-medium text-white">BASL No.:</span>
                <span className="ml-1">2274</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Validity: Jun 04, 2025 – Perpetual</div>
            </div>

            <p className="text-sm text-slate-300">
              Growksh Wealthcraft LLP is a SEBI Registered Investment Adviser. Advisory services are offered under Krutika Kathal’s individual RIA license.
            </p>

            <div className="text-xs text-slate-500 mt-2">
              <div>Registered Address: Kothrud, Pune</div>
              <div>Address: Jijaji Nagari, Borate Farms 54/4, Kothrud</div>
            </div>
          </div>

          <div className="flex justify-start md:justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <nav aria-label="About and contact" className="flex flex-col space-y-2">
                <Link to="/" className="text-sm text-slate-300 hover:text-white transition">Home</Link>
                <Link to="/about" className="text-sm text-slate-300 hover:text-white transition">About</Link>
                <Link to="/contact" className="text-sm text-slate-300 hover:text-white transition">Contact</Link>
              </nav>
              <nav aria-label="Primary links" className="flex flex-col space-y-2">
                <Link to="/wealthcraft" className="text-sm text-slate-300 hover:text-white transition">Advisory</Link>
                <Link to="/alphalabs" className="text-sm text-slate-300 hover:text-white transition">Education</Link>
                <Link to="/ventures" className="text-sm text-slate-300 hover:text-white transition">Asset Management</Link>
                <Link to="/insights" className="text-sm text-slate-300 hover:text-white transition">Resources</Link>
              </nav>

             
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center space-x-3">
              <a href="https://www.linkedin.com/in/krutikakathal/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-300 hover:text-white transition">
                <FaLinkedin className="w-6 h-6" />
              </a>

              <a href="https://www.instagram.com/krutikakathal/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-white transition">
                <FaInstagram className="w-6 h-6" />
              </a>

              <a href="https://www.facebook.com/krutika.kathal" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-300 hover:text-white transition">
                <FaFacebookF className="w-6 h-6" />
              </a>

              <a href="https://www.youtube.com/@Krutika.Kathal" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-300 hover:text-white transition">
                <FaYoutube className="w-6 h-6" />
              </a>
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
