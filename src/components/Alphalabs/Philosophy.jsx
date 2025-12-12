import React from 'react'

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden text-slate-900">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#00674F]/8 to-[#00674F]/4 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#00674F]/6 to-[#00674F]/3 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      
      {/* Abstract Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-[#00674F]/20 rounded-full" />
        <div className="absolute bottom-1/4 right-20 w-24 h-24 border-2 border-[#00674F]/18 rounded-full" />
        <div className="absolute top-1/3 right-40 w-16 h-16 border-2 border-[#00674F]/16 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full bg-[#00674F]/10 border border-[#00674F]/20 ">
              <div className="w-2 h-2 bg-[#00674F] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#00674F] uppercase tracking-wide">Our Philosophy</span>
            </div>

            {/* Heading with gradient */}
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Learning that Helps You Create{' '}
              <span className="relative inline-block">
                  <span className="relative z-10 text-[#00674F]">
                    Life Alpha
                  </span>
                  <span className="absolute inset-0 bg-[#00674F]/8 blur-xl rounded-lg" />
              </span>
              .
            </h2>

            {/* Quote */}
            <div className="relative">
              <div className="absolute -left-6 top-0 text-5xl text-[#00674F]/30 font-serif">"</div>
              <blockquote className="text-lg text-slate-700 pl-4 border-l-4 border-[#ffde21] italic leading-relaxed">
                In investing, alpha means outperformance. In life, we believe alpha comes from awareness — the ability to connect dots, make informed choices, and stay grounded under uncertainty.
              </blockquote>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-lg text-slate-700 leading-relaxed">
                Growksh Alphalabs was built as a lab — a space for experimentation, reflection, and experiential learning in finance.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Our mission is simple: to make people financially intelligent, emotionally resilient, and purpose-driven through real-world learning experiences.
              </p>
            </div>
          </div>

          {/* Right Visual */}
        <div className="relative h-full">
  <div className="relative bg-gradient-to-br from-white to-[#00674F]/12 rounded-3xl p-6 md:p-8 shadow-2xl border border-[#00674F]/12 overflow-hidden h-full flex flex-col justify-center">
    {/* Floating Elements - Adjust positions for mobile */}
    <div className="absolute top-4 right-4 w-12 h-12 md:top-6 md:right-6 md:w-16 md:h-16 bg-[#00674F]/8 rounded-2xl rotate-12" />
    <div className="absolute bottom-4 left-4 w-8 h-8 md:bottom-8 md:left-8 md:w-12 md:h-12 bg-[#00674F]/6 rounded-full" />

    {/* Main Visual */}
    <div className="relative z-10">
      {/* Alpha Symbol - Responsive sizing */}
      <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
        <div className="absolute inset-0 bg-[#00674F]/8 rounded-full blur-xl" />
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-[4.5rem] sm:text-[5.5rem] md:text-[6rem] lg:text-[9rem] xl:text-[12rem] font-bold bg-gradient-to-r from-[#00A67A] to-[#00A67A]/20 bg-clip-text text-transparent leading-none">
            α
          </div>
        </div>
      </div>

      {/* Radiating Circles - Responsive sizing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 border border-[#00674F]/20 rounded-full animate-pulse-slow" />
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 border border-[#00674F]/12 rounded-full animate-pulse-slower" />
      </div>

      {/* Connector Dots - Adjust sizes and positions for mobile */}
      <div className="absolute top-[20%] left-[15%] w-2 h-2 md:top-1/4 md:left-1/4 md:w-3 md:h-3 bg-[#00674F] rounded-full animate-bounce" />
      <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 md:top-1/3 md:right-1/3 md:w-2 md:h-2 bg-[#00674F]/70 rounded-full animate-bounce delay-150" />
      <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 md:bottom-1/4 md:left-1/3 md:w-2 md:h-2 bg-[#00674F]/60 rounded-full animate-bounce delay-300" />
      <div className="absolute bottom-[30%] right-[15%] w-2 h-2 md:bottom-1/3 md:right-1/4 md:w-3 md:h-3 bg-[#00674F]/50 rounded-full animate-bounce delay-450" />
    </div>

    {/* Bottom Text - Responsive font sizes */}
    <div className="mt-2 text-center">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">The Alpha Mindset</h3>
      <p className="text-sm sm:text-base text-slate-600 px-2">
        Where financial insight meets personal growth
      </p>
    </div>
  </div>

  {/* Floating Card 1 - Adjust position and size for mobile */}
  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-[#00674F]/8 w-36 sm:w-40 md:w-48">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#00674F]/8 rounded-full flex items-center justify-center">
        <span className="text-[#00674F] font-bold text-sm sm:text-base">→</span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-slate-900">Outperformance</span>
    </div>
  </div>

  {/* Floating Card 2 - Adjust position and size for mobile */}
  <div className="absolute -bottom-2 -right-10 sm:-bottom-3 sm:-right-16 md:-bottom-4 md:-right-20 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-[#00674F]/8 w-36 sm:w-40 md:w-48">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#00674F]/8 rounded-full flex items-center justify-center">
        <span className="text-[#00674F] font-bold text-sm sm:text-base">⚡</span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-slate-900">Awareness</span>
    </div>
  </div>
</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.1;
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(0);
          }
          50% {
            opacity: 0.05;
            transform: translateY(-4px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }

        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow,
          .animate-pulse-slower,
          .animate-bounce {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}