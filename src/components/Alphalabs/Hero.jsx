import React from 'react'

export default function Hero() {
  return (
    <section className="py-20 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">The Financial Learning Studio</h1>
        <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-6">Where financial understanding turns into life confidence.</p>

        <p className="text-md text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">Growksh Alphalabs is an experiential learning studio by Growksh — designed to help individuals think, decide, and grow smarter with money. Here, finance isn’t just taught — it’s experienced, questioned, and understood deeply, so you can make better choices in your financial life and beyond.</p>

        <div className="flex justify-center gap-4">
          <a href="#programs" className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow">Explore Programs</a>
          <a href="#community" className="px-6 py-3 border-2 border-yellow-400 text-yellow-500 font-semibold rounded-full">Join the Learning Circle</a>
        </div>

        <div className="mt-10">
          {/* simple visual placeholder */}
          <div className="mx-auto w-64 h-40 rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center text-sm text-slate-700">Illustration: Lab / Neural network</div>
        </div>
      </div>
    </section>
  )
}
