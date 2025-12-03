import React from 'react'

export default function FinalCTA(){
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold text-black mb-4">Your Financial Learning Journey Starts Here.</h3>
        <p className="text-slate-700 mb-6">Whether you’re learning to manage your own money or preparing to build a career in finance, Alphalabs gives you the space to explore, learn, and evolve.</p>
        <div className="flex justify-center gap-4">
          <a href="#programs" className="px-6 py-3 bg-[#ffde21] text-black rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffde21]">Enroll in F³</a>
          <a href="#community" className="px-6 py-3 border-2 border-[#ffde21] text-black rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffde21]">Join the Alphalabs Community</a>
        </div>
      </div>
    </section>
  )
}
