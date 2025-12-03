import React, { useState } from 'react'
import a1 from '../../assets/i1.png'
import a2 from '../../assets/i2.png'
import a3 from '../../assets/i3.png'

const sample = [
  { 
    quote: "Hi team. Want to express my gratitude for the outstanding work you are doing. The expertise you bring to the table and attention to detail with which you have handled all my queries is exceptional. Am sure my finances are in trusted hands. Would be glad to recommend your services. Wishing you the very best 🙂", 
    name: 'Aastha Sharma', 
    avatar: a3, 
    role: '',
    initial: 'A'
  },
  { 
    quote: "TRUST. CLARITY. IMPLEMENTATION is what describes Krutika. In the race of making money Krutika makes you pause and plan your future in a more organised and a strategic way. She would not just show you the path but also hold your hand and help you implement the same. Many times we just need that little push and confidence to take the risk while investing into different mediums and that is what you get when you work with Krutika. This is my way of saying thankyou for answering and replying to all my whatsapp queries at odd times and for educating me on things and terms that always made me feel so intimidated.", 
    name: 'Garima Bhandari', 
    avatar: a3, 
    role: '',
    initial: 'G'
  },
  { 
    quote: "I have been associated with Krutika for more than 6 mons regarding financial planning. Since I am not from finance background and don't understand much in this field, she educated me on the subject. She explained to me everything in detail and made a comprehensive financial plan for me. The plan is as per my goals and my risk appetite. We have had one review meeting since then. I'm so happy with the service she provided me. Thank you so much Krutika.🤝🙏", 
    name: 'Vikas Damare', 
    avatar: a1, 
    role: '',
    initial: 'V'
  },
  { 
    quote: "I and my wife would like to express our thanks to Krutika and her team for the work they have done for us over the past month. We were very impressed with the personalised professional service and advice given to us and how you have tailored this specifically to suit our situation and future needs. Krutika has simplified all complex financial terms to start off with our strategic investment planning. I have no hesitation in recommending your services with complete trust. Kudos to the entire team of Growksh!", 
    name: 'Sameer Mhaske', 
    avatar: a2, 
    role: '',
    initial: 'S'
  }
]

export default function Testimonials() {
  // State to track expanded quotes for each testimonial
  const [expandedQuotes, setExpandedQuotes] = useState({})
  
  // Create a duplicate of the testimonials for seamless looping
  const testimonials = [...sample, ...sample, ...sample]


  const toggleQuote = (index) => {
    setExpandedQuotes(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Function to truncate text
  const truncateText = (text, length = 150) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      {/* subtle emerald cloud behind the cards */}
      <div aria-hidden="true" className="absolute -left-32 -top-20 w-80 h-80 rounded-full bg-emerald-100/40" style={{ filter: 'blur(64px)' }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Real <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">People</span>. 
            Real <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">Results</span>.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stories from clients who found clarity, confidence and better financial outcomes.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden py-2">
          {/* Gradient Fade Effects on Sides */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          
          {/* Marquee Wrapper */}
          <div className="flex animate-marquee gap-6">
            {testimonials.map((s, i) => {
              const isExpanded = expandedQuotes[i] || false
              const displayText = isExpanded ? s.quote : truncateText(s.quote, 120)
              const shouldShowReadMore = s.quote.length > 120
              
              return (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-[380px]"
                >
                  <figure 
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Initial Circle */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200">
                        <span className="text-xl font-bold text-emerald-700">{s.initial}</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">{s.name}</div>
                      </div>
                    </div>

                    {/* Quote with Read More */}
                    <blockquote className="text-slate-600 text-sm leading-relaxed flex-1 mb-3"> 
                      "{displayText}"
                    </blockquote>

                    {/* Read More/Less Button */}
                    {shouldShowReadMore && (
                      <button
                        onClick={() => toggleQuote(i)}
                        className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors mb-3 text-left self-start"
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                        <svg 
                          className={`w-4 h-4 inline-block ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Avatar at bottom */}
                    <figcaption className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <img 
                        src={s.avatar} 
                        alt={`${s.name} avatar`} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100" 
                        loading="lazy" 
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.role}</div>
                      </div>
                    </figcaption>
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

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .animate-marquee::-webkit-scrollbar {
            height: 8px;
          }
          
          .animate-marquee::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          
          .animate-marquee::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          
          .animate-marquee::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .animate-marquee > div {
            width: 320px;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 3 - 72px));
            }
          }
        }

        @media (max-width: 640px) {
          .animate-marquee > div {
            width: 280px;
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
      `}</style>
    </section>
  )
}