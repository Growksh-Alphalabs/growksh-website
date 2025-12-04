import React from "react";

export default function GrowkshLanding() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1a1f] via-[#0d2229] to-[#020b0f] text-white flex flex-col justify-between">

      {/* HEADER */}
      <header className="px-6 md:px-10 pt-8 pb-4 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto">
         
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-5xl w-full">
          
          {/* Hero Section with Glow Effect (centered) */}
          <div className="relative mb-16 md:mb-24 min-h-[60vh] flex items-center justify-center">
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-sky-500/10 blur-3xl rounded-full opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Growksh Ventures: <span className="block mt-4">Exploring new frontiers</span>
                <span className="block mt-2">of financial innovation</span>
              </h1>
              
              <p className="text-xl text-gray-300/80 mt-8 max-w-3xl leading-relaxed">
                We're working behind the scenes to create something valuable — something that will take the Growksh experience to the next level.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-12 md:my-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Stay tuned. Something thoughtful is taking shape.
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-900/40 to-gray-900/10 border border-gray-800/50 backdrop-blur-sm">
                <p className="text-lg text-gray-300/90 leading-relaxed">
                  Growth is a journey — and at Growksh, we're constantly experimenting, innovating, and evolving to bring more value to your financial life.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-900/40 to-gray-900/10 border border-gray-800/50 backdrop-blur-sm">
                <p className="text-lg text-gray-300/90 leading-relaxed">
                  Growksh Ventures is the next chapter in that journey. We can't reveal much right now… but let's just say it's something designed to make your money work smarter, easier, and more meaningfully.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8">
              <button className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/20 overflow-hidden">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/0 via-sky-400/20 to-sky-400/0 pointer-events-none translate-x-[-120%] group-hover:translate-x-[120%] opacity-0 group-hover:opacity-100 transition duration-700 ease-out"></div>
                <span className="relative">Stay Updated</span>
              </button>
              
              <button className="flex-1 px-8 py-4 bg-gray-900/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
}