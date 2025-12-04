import React from 'react'
import { Link } from 'react-router-dom'

export default function Community() {
  const benefits = [
    {
      icon: '🎯',
      title: 'Exclusive Mini-Sessions',
      description: 'Get invites to free workshops, guest talks, and expert Q&A sessions reserved for community members.',
      gradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description: 'Access curated worksheets, financial templates, calculators, and practical toolkits for real-world application.',
      gradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: '🤝',
      title: 'Network & Connect',
      description: 'Engage with educators, finance professionals, investors, and like-minded learners in a supportive space.',
      gradient: 'from-emerald-500/10 to-teal-500/10'
    }
  ]


  return (
    <section id="community" className="relative py-20 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 -z-10" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute -top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join{' '}
            <span className="relative inline-block">
              <span className="relative z-10">
                The <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Alpha Circle</span> - Our Learning Community
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-300/20 to-yellow-400/20 blur-xl -z-10" />
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            A vibrant, like-minded community of learners who are curious about money, growth, and self-improvement.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-b from-gray-900/50 to-black rounded-2xl p-8 border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Corner Number */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center">
                <span className="text-sm font-bold text-yellow-400">0{index + 1}</span>
              </div>
              
              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{benefit.icon}</span>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

      

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Financial Journey?
            </h3>
            <p className="text-gray-400">
              Join thousands of learners who've found clarity, confidence, and community in the Alpha Circle.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="#"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Join The Alpha Circle
              <svg 
                className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
           
          </div>
          
        
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .group:hover\:-translate-y-2,
          .group:hover\:scale-110 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}