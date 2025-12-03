import React from 'react'

export default function FinalCTA(){
  return (
    <section className="py-16 bg-emerald-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">Your Financial Learning Journey Starts Here.</h3>
        <p className="text-slate-700 mb-6">Whether you’re learning to manage your own money or preparing to build a career in finance, Alphalabs gives you the space to explore, learn, and evolve.</p>
        <div className="flex justify-center gap-4">
          <a href="#programs" className="px-6 py-3 bg-yellow-400 rounded-full font-semibold">Enroll in F³</a>
          <a href="#community" className="px-6 py-3 border-2 border-yellow-400 text-yellow-500 rounded-full font-semibold">Join the Alphalabs Community</a>
        </div>
      </div>
    </section>
  )
}
