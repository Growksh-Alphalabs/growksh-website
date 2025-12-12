import React, { useEffect, useRef, useState } from 'react'
import a1 from '../../assets/Testimonial client Photos/Aastha Sharma.jpg'
import a2 from '../../assets/Testimonial client Photos/Satyawan Aglawe.jpg'
import a3 from '../../assets/Testimonial client Photos/Garima Bhandari.png'

const testimonials = [
  { 
    quote: 'Hi team. Want to express my gratitude for the outstanding work you are doing. The expertise you bring to the table and attention to detail with which you have handled all my queries is exceptional. Am sure my finances are in trusted hands. Would be glad to recommend your services. Wishing you the very best 🙂', 
    name: 'Aastha Sharma', 
    location: '',
    role: '',
    avatarColor: 'bg-[#3dc7f5]',
    initials: 'AS',
    avatar: a1
  },
  { 
    quote: 'Hi Growksh team, first of all thank you So much for all your support and handholding. You made trading so easy that anybody can do it and enjoy the freedom of time and money in long run. You guys are simply awesome, kind hearted and always ready to help. You are strategic thinkers, and your system oriented approach is a must learn for everyone. More blessings and power to you to touch many more lives !! Thank you so much for all the knowledge and help !!', 
    name: 'Satyawan Aglawe', 
    location: '',
    role: '',
    avatarColor: 'bg-[#3dc7f5]',
    initials: 'SA',
    avatar: a2
  },
  { 
    quote: 'TRUST. CLARITY. IMPLEMENTATION \n is what describes Krutika. In the race of making money Krutika makes you pause and plan your future in a more organised and a strategic way. She would not just show you the path but also hold your hand and help you implement the same. Many times we just need that little push and confidence to take the risk while investing into different mediums and that is what you get when you work with Krutika. This is my way of saying thankyou for answering and replying to all my whatsapp queries at odd times and for educating me on things and terms that always made me feel so intimidated.', 
    name: 'Garima Bhandari', 
    location: '',
    role: '',
    avatarColor: 'bg-[#3dc7f5]',
    initials: 'GB',
    avatar: a3
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

  const [expandedQuoteIndex, setExpandedQuoteIndex] = useState(null)

  const toggleExpanded = (idx) => {
    setExpandedQuoteIndex(prev => (prev === idx ? null : idx))
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Header */}
          <div className="space-y-4">
            <span className="text-sm font-medium text-[#cf87bf]">TRUST & IMPACT</span>
            
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Voices of <span className="text-[#cf87bf]">Confidence</span>
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
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#3dc7f5] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial content slider */}
              <div ref={wrapperRef} className="relative overflow-hidden h-[220px] sm:h-[280px]">
                <div
                  ref={containerRef}
                  className="transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(${translateY}px)` }}
                >
                  {testimonials.map((testimonial, idx) => {
                    const full = String(testimonial.quote || '')
                    const isLong = full.length > 220
                    const isExpanded = expandedQuoteIndex === idx
                    const truncated = isLong ? full.slice(0, 220).trimEnd() + '…' : full

                    return (
                      <div key={idx} className="h-[220px] sm:h-[280px] flex flex-col justify-center">
                        <blockquote
                          className={`${isLong ? 'text-base' : 'text-xl lg:text-xl'} font-medium text-slate-800 leading-relaxed whitespace-pre-wrap break-words ${isExpanded ? 'max-h-[160px] overflow-auto' : 'max-h-[140px] overflow-hidden'}`}
                        >
                          "{isLong && !isExpanded ? truncated : full}"
                        </blockquote>

                        {isLong && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleExpanded(idx)}
                              className="text-sm text-[#cf87bf] hover:underline"
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          </div>
                        )}

                        <div className="mt-6 flex items-center gap-4">
                          {testimonial.avatar ? (
                            <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100" loading="lazy" />
                          ) : (
                            <div className={`w-14 h-14 rounded-full ${testimonial.avatarColor} flex items-center justify-center`}>
                              <span className="text-lg font-semibold text-slate-700">{testimonial.initials}</span>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 text-lg">{testimonial.name}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
                        ? 'bg-[#3dc7f5] w-12' 
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