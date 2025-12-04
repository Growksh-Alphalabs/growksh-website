import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use native smooth scroll if available; fallback to instant
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      } catch (e) {
        window.scrollTo(0, 0)
      }
    }
  }, [pathname])

  return children || null
}
