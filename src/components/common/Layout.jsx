import React from 'react'
import Navbar from './Navbar'
import Footer from '../Footer/Footer'

export default function Layout({ children }) {
  return (
    <div className="gk-app">
      <Navbar />
      <main className="gk-main">{children}</main>
      <Footer />
    </div>
  )
}
