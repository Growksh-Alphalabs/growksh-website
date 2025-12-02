import React, { useEffect, useRef, useState } from 'react'

function Counter({ end, suffix = '', prefix = '', duration = 1400, startOn = false }) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    if (!startOn) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * end))
      if (progress < 1) {
        startRef.current = requestAnimationFrame(step)
      }
    }
    startRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(startRef.current)
  }, [end, duration, startOn])

  return (
    <div className="text-3xl md:text-4xl font-bold tracking-tight">
      {prefix}{value}{suffix}
    </div>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      })
    }, { threshold: 0.3 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const items = [
    { id: 1, end: 5, prefix: '₹', suffix: '+ Cr', label: 'Wealth Advised' },
    { id: 2, end: 60, suffix: '+', label: 'Families Under Management' },
    { id: 3, end: 36, suffix: '+', label: 'Years Combined Experience' },
    { id: 4, end: 98, suffix: '%', label: 'Client Retention' },
  ]

  return (
    <section ref={ref} className="py-16 bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Numbers That Speak for Themselves</h2>
          <p className="mt-2 text-slate-300">Each number represents a life transformed through mindful financial guidance.</p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className={`p-6 rounded-xl text-center transition transform border border-slate-800 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${idx * 120}ms`, background: 'linear-gradient(180deg, rgba(17,24,39,0.6), rgba(15,23,42,0.55))' }}
            >
              <div className="inline-block px-3 py-2 rounded-md text-white">
                <div aria-live="polite">
                  <Counter end={it.end} prefix={it.prefix || ''} suffix={it.suffix || ''} startOn={visible} />
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-300">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
