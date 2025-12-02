import React, { useEffect, useRef, useState } from 'react'

const testimonials = [
  { 
    quote: 'Growksh helped me look at money differently. I’m finally confident about my future goals.', 
    name: 'Priya Sharma', 
    location: 'Pune, India',
    role: 'Senior IT Professional',
    avatarColor: 'bg-purple-100',
    initials: 'PS'
  },
  { 
    quote: 'Their personalised advice gave me clarity and control. Highly recommended for NRIs.', 
    name: 'Rohit Kapoor', 
    location: 'Dubai, UAE',
    role: 'NRI Investor',
    avatarColor: 'bg-emerald-100',
    initials: 'RK'
  },
  { 
    quote: 'Professional, empathetic and clear. I feel empowered to make better financial decisions.', 
    name: 'Asha Patel', 
    location: 'Bangalore, India',
    role: 'Woman Investor',
    avatarColor: 'bg-violet-100',
    initials: 'AP'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [translateY, setTranslateY] = useState(0)

  // Auto-advance
  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [paused])

  // Update translate when index or wrapper size changes
  useEffect(() => {
    const update = () => {
      const height = wrapperRef.current?.clientHeight || 280
      setTranslateY(-currentIndex * height)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [currentIndex])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Header */}
          <div className="space-y-4">
            <span className="text-sm font-medium text-purple-700">Trust & Impact</span>
            
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">Confidence</span>
            </h2>
            
            <p className="text-lg text-slate-600 max-w-lg">
              Hear from professionals, NRIs, and women investors who transformed their financial journey with Growksh.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-500">Client Satisfaction</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900">50+</div>
                <div className="text-sm text-slate-500">Cities Served</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900">4.9★</div>
                <div className="text-sm text-slate-500">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Testimonial Carousel */}
          <div className="relative">
            <div 
              className="relative bg-white rounded-2xl shadow-xl p-8 lg:p-10"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial content slider */}
              <div ref={wrapperRef} className="relative overflow-hidden h-[280px]">
                <div
                  ref={containerRef}
                  className="transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(${translateY}px)` }}
                >
                  {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="h-[280px] flex flex-col justify-center">
                      <blockquote className="text-xl lg:text-2xl font-medium text-slate-800 leading-relaxed">"{testimonial.quote}"</blockquote>

                      <div className="mt-8 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full ${testimonial.avatarColor} flex items-center justify-center`}>
                          <span className="text-lg font-semibold text-slate-700">{testimonial.initials}</span>
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-lg">{testimonial.name}</div>
                          <div className="text-slate-600">{testimonial.role}</div>
                          <div className="text-sm text-slate-500 mt-1">{testimonial.location}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-8 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 w-12' 
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}