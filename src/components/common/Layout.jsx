import React from 'react'
import Navbar from './Navbar'
import Footer from '../Footer/Footer'

export default function Layout({ children }) {
  return (
    <div >
      <Navbar />
      <main className="gk-main">{children}</main>
      <Footer />
    </div>
  )
}
