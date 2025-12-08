import React from 'react'
import ContactForm from '../components/Contact/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      value: "+91 98765 43210",
      description: "Available during business hours"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "hello@growksh.com",
      description: "General inquiries & support",
      link: "mailto:hello@growksh.com"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Office",
      value: "Pune, India",
      description: "Headquarters location"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Hours",
      value: "Mon — Fri, 9:00 — 18:00",
      description: "Indian Standard Time"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#00674F]/5 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Abstract Green Shapes */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#00674F]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#00674F]/3 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #00674F 1px, transparent 1px),
                            linear-gradient(to bottom, #00674F 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00674F]/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 400}px`,
                top: `${Math.random() * 400}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <header className="max-w-4xl mx-auto px-6 py-8 md:py-8 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#00674F]/10 shadow-sm mb-8 group hover:shadow-md transition-shadow duration-300">
            <div className="w-2 h-2 rounded-full bg-[#00674F] animate-pulse" />
            <span className="text-sm font-medium text-[#00674F] uppercase tracking-wide">Contact Us</span>
            <div className="w-2 h-2 rounded-full bg-[#00674F]/50" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Get In Touch With{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#00674F] via-[#009A7B] to-[#00674F] bg-clip-text text-transparent">
                Growksh
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00674F]/20 via-[#009A7B]/20 to-[#00674F]/20 blur-xl -z-10" />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Tell us about your goals and we'll suggest the right next steps — a discovery call, program info, or partnership details.
          </p>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-[#00674F]/10 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00674F] to-[#005e48] flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Get in touch</h2>
                    <p className="text-slate-600">Multiple ways to reach out</p>
                  </div>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {contactInfo.map((item, index) => (
                    <div 
                      key={index}
                      className="group relative p-5 rounded-xl border border-[#00674F]/5 hover:border-[#00674F]/20 bg-white/50 hover:bg-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#00674F]/10 flex items-center justify-center group-hover:bg-[#00674F]/20 transition-colors">
                          <div className="text-[#00674F]">
                            {item.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-700 mb-1">{item.title}</h4>
                          {item.link ? (
                            <a 
                              href={item.link} 
                              className="block text-base font-medium text-[#00674F] hover:text-[#004D36] transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-base font-medium text-slate-900">{item.value}</p>
                          )}
                          <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Partnership Email */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-[#00674F]/5 to-[#009A7B]/5 border border-[#00674F]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00674F]/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#00674F]" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-700">For Partnerships</h4>
                  </div>
                  <a 
                    href="mailto:partners@growksh.com" 
                    className="text-lg font-medium text-[#00674F] hover:text-[#004D36] transition-colors"
                  >
                    partners@growksh.com
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#00674F]/10 shadow-lg">
                  <div className="text-3xl font-bold text-[#00674F] mb-2">24h</div>
                  <div className="text-sm text-slate-600">Response Time</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#00674F]/10 shadow-lg">
                  <div className="text-3xl font-bold text-[#00674F] mb-2">98%</div>
                  <div className="text-sm text-slate-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#00674F]/10 p-8 shadow-xl sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00674F] to-[#005e48] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Schedule a call</h2>
                    <p className="text-slate-600">Let's discuss your goals</p>
                  </div>
                </div>

                <ContactForm />

                <div className="mt-8 pt-8 border-t border-[#00674F]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00674F]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#00674F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600">
                      Your information is secure and will only be used to contact you regarding your inquiry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .group:hover\:-translate-y-1 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}