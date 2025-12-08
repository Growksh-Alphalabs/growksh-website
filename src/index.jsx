import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Wealthcraft from './pages/Wealthcraft/Wealthcraft'
import Alphalabs from './pages/Alphalabs/Alphalabs'
import Ventures from './pages/Ventures/Ventures'
import Insights from './pages/Insights/Insights'
import Contact from './pages/Contact'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/wealthcraft" element={<Wealthcraft/>} />
          <Route path="/alphalabs" element={<Alphalabs/>} />
          <Route path="/ventures" element={<Ventures/>} />
          <Route path="/insights" element={<Insights/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
)
