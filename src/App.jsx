import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import ScrollToTop from './components/common/ScrollToTop'
import ProtectedRoute from './components/common/ProtectedRoute'
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
import AdminLogin from './components/Auth/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop>
          <Routes>
            {/* Main Routes - with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/wealthcraft" element={<Wealthcraft />} />
              <Route path="/alphalabs" element={<Alphalabs />} />
              <Route path="/ventures" element={<Ventures />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes - with Layout (Navbar) */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/auth/verify-email" element={<VerifyEmail />} />
            </Route>

            {/* Admin Routes - NOT in Layout (no navbar for admin panel) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true} fallbackRoute="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ScrollToTop>
      </AuthProvider>
    </BrowserRouter>
  )
}
