import React, { useState, useEffect, useRef } from 'react'
import a1 from '../../assets/Testimonial client Photos/Aastha Sharma.jpg'
import a2 from '../../assets/Testimonial client Photos/Garima Bhandari.png'
import a3 from '../../assets/Testimonial client Photos/Vikas Damare.jpg'
import a4 from '../../assets/Testimonial client Photos/Sameer Mhaske.png'

const sample = [
  { 
    quote: "Hi team. Want to express my gratitude for the outstanding work you are doing. The expertise you bring to the table and attention to detail with which you have handled all my queries is exceptional. Am sure my finances are in trusted hands. Would be glad to recommend your services. Wishing you the very best 🙂", 
    name: 'Aastha Sharma', 
    avatar: a1, 
    role: '',
    initial: 'A'
  },
  { 
    quote: "TRUST. CLARITY. IMPLEMENTATION is what describes Krutika. In the race of making money Krutika makes you pause and plan your future in a more organised and a strategic way. She would not just show you the path but also hold your hand and help you implement the same. Many times we just need that little push and confidence to take the risk while investing into different mediums and that is what you get when you work with Krutika. This is my way of saying thankyou for answering and replying to all my whatsapp queries at odd times and for educating me on things and terms that always made me feel so intimidated.", 
    name: 'Garima Bhandari', 
    avatar: a2, 
    role: '',
    initial: 'G'
  },
  { 
    quote: "I have been associated with Krutika for more than 6 mons regarding financial planning. Since I am not from finance background and don't understand much in this field, she educated me on the subject. She explained to me everything in detail and made a comprehensive financial plan for me. The plan is as per my goals and my risk appetite. We have had one review meeting since then. I'm so happy with the service she provided me. Thank you so much Krutika.🤝🙏", 
    name: 'Vikas Damare', 
    avatar: a3, 
    role: '',
    initial: 'V'
  },
  { 
    quote: "I and my wife would like to express our thanks to Krutika and her team for the work they have done for us over the past month. We were very impressed with the personalised professional service and advice given to us and how you have tailored this specifically to suit our situation and future needs. Krutika has simplified all complex financial terms to start off with our strategic investment planning. I have no hesitation in recommending your services with complete trust. Kudos to the entire team of Growksh!", 
    name: 'Sameer Mhaske', 
    avatar: a4, 
    role: '',
    initial: 'S'
  }
]

export default function Testimonials() {
  const [expandedQuotes, setExpandedQuotes] = useState({})
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const marqueeRef = useRef(null)
  const containerRef = useRef(null)
  const scrollIntervalRef = useRef(null)
  const pauseTimeoutRef = useRef(null)
  
  // Create a duplicate of the testimonials for seamless looping
  const testimonials = [...sample, ...sample, ...sample]

  // Track which testimonial is currently expanded
  const [currentlyExpanded, setCurrentlyExpanded] = useState(null)

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Auto-scroll functionality for mobile
  useEffect(() => {
    if (!isMobile || !marqueeRef.current) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
      return
    }

    const startAutoScroll = () => {
      const marqueeElement = marqueeRef.current
      if (!marqueeElement) return

      const scrollSpeed = 1 // pixels per interval
      const scrollInterval = 30 // milliseconds

      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }

      scrollIntervalRef.current = setInterval(() => {
        if (marqueePaused) return
        
        marqueeElement.scrollLeft += scrollSpeed
        
        // Reset to start for infinite scroll effect
        if (marqueeElement.scrollLeft >= marqueeElement.scrollWidth - marqueeElement.clientWidth) {
          marqueeElement.scrollLeft = 0
        }
      }, scrollInterval)
    }

    // Only start scrolling if not paused
    if (!marqueePaused) {
      startAutoScroll()
    } else {
      // Clear interval if paused
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }
  }, [isMobile, marqueePaused])

  const toggleQuote = (id) => {
    const willBeExpanded = !expandedQuotes[id]
    
    setExpandedQuotes(prev => ({
      ...prev,
      [id]: willBeExpanded
    }))

    // Update currently expanded testimonial
    if (willBeExpanded) {
      setCurrentlyExpanded(id)
    } else {
      setCurrentlyExpanded(null)
    }

    // FOR MOBILE VIEW: Always stop scrolling when Read More is clicked
    if (willBeExpanded) {
      // Immediately pause scrolling
      setMarqueePaused(true)
      
      // Clear any existing timeouts
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
        pauseTimeoutRef.current = null
      }
    } else {
      // For Read Less: resume scrolling after a short delay
      // But only if we're on mobile
      if (isMobile) {
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current)
        }
        pauseTimeoutRef.current = setTimeout(() => {
          setMarqueePaused(false)
        }, 300)
      } else {
        // For desktop: resume on mouse leave
        // The mouse leave handler will take care of it
      }
    }
  }

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [])

  // Function to truncate text
  const truncateText = (text, length = 150) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  // Handle touch events for mobile
  const handleTouchStart = () => {
    // On mobile touch, only pause if no testimonial is expanded
    if (isMobile && !currentlyExpanded) {
      setMarqueePaused(true)
    }
  }

  const handleTouchEnd = () => {
    // On mobile touch end, only resume if no testimonial is expanded
    if (isMobile && !currentlyExpanded) {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
      pauseTimeoutRef.current = setTimeout(() => {
        if (!currentlyExpanded) {
          setMarqueePaused(false)
        }
      }, 2000)
    }
  }

  // Handle click outside to resume scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicking outside of any testimonial and there's an expanded one, collapse it
      if (currentlyExpanded && !e.target.closest('figure')) {
        setExpandedQuotes(prev => ({
          ...prev,
          [currentlyExpanded]: false
        }))
        setCurrentlyExpanded(null)
        
        // Resume scrolling after delay
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current)
        }
        pauseTimeoutRef.current = setTimeout(() => {
          setMarqueePaused(false)
        }, 300)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [currentlyExpanded, isMobile])

  // Handle mouse enter/leave for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      setMarqueePaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && !currentlyExpanded) {
      setMarqueePaused(false)
    }
  }

  return (
    <section id="testimonials" className="py-16 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Real <span className="text-[#ffde21]">People</span>. 
            Real <span className="text-[#ffde21]">Results</span>.
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Stories from clients who found clarity, confidence and better financial outcomes.
          </p>
        </div>

        {/* Marquee Container */}
        <div 
          className="relative overflow-hidden py-2"
          ref={containerRef}
        >
          {/* Gradient Fade Effects on Sides */}
          {!isMobile && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
            </>
          )}
          
          {/* Marquee Wrapper */}
          <div
            ref={marqueeRef}
            className={`flex gap-6 ${!isMobile ? 'animate-marquee' : 'overflow-x-auto'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ 
              animationPlayState: (!isMobile && marqueePaused) ? 'paused' : 'running',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {testimonials.map((s, i) => {
              const instanceId = `t-${i}`
              const isExpanded = expandedQuotes[instanceId] || false
              const displayText = isExpanded ? s.quote : truncateText(s.quote, 120)
              const shouldShowReadMore = s.quote.length > 120
              
              return (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-[380px] md:w-[320px] sm:w-[280px]"
                >
                  <figure 
                    className="bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-slate-700 relative"
                  >
                    {/* Initial Circle */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={s.avatar}
                        alt={`${s.name} avatar`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                        loading="lazy"
                      />
                      <div>
                        <div className="text-lg font-bold text-slate-100">{s.name}</div>
                      </div>
                    </div>

                    {/* Quote with Read More */}
                    <blockquote className="text-slate-300 text-sm leading-relaxed flex-1 mb-3"> 
                      "{displayText}"
                    </blockquote>

                    {/* Read More/Less Button */}
                    {shouldShowReadMore && (
                      <button
                        onClick={() => toggleQuote(instanceId)}
                        className="text-[#ffde21] text-sm font-medium hover:text-[#ffde21]/80 transition-colors mb-3 text-left self-start z-20 relative"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}

                    {/* Overlay to indicate paused state */}
                    {isExpanded && (
                      <div className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none" />
                    )}
                  </figure>
                </div>
              )
            })}
          </div>
        </div>

       
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-380px * 3 - 72px)); /* 3 cards + gaps */
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            overflow-x: auto;
            padding-bottom: 8px;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 3 - 72px));
            }
          }
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation: none;
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * 3 - 72px));
            }
          }
        }

        @media (max-width: 640px) {
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-250px * 3 - 72px));
            }
          }
        }
      `}</style>
    </section>
  )
}