import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import ScrollToTop from './components/common/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Wealthcraft from './pages/Wealthcraft/Wealthcraft'
import Alphalabs from './pages/Alphalabs/Alphalabs'
import Ventures from './pages/Ventures/Ventures'
import Insights from './pages/Insights/Insights'
import Contact from './pages/Contact'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import VerifyEmail from './components/Auth/VerifyEmail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop>
          <Routes>
            {/* Auth Routes - without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            
            {/* Main Routes - with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/wealthcraft" element={<Wealthcraft />} />
              <Route path="/alphalabs" element={<Alphalabs />} />
              <Route path="/ventures" element={<Ventures />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </AuthProvider>
    </BrowserRouter>
  )
}
