import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="gk-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
