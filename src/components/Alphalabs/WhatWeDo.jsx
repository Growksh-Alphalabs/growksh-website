import React from 'react'

export default function WhatWeDo(){
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">We Simplify Finance, Without Oversimplifying Life.</h3>
        <p className="text-slate-700 mb-6">Alphalabs goes beyond textbook knowledge and market jargon. We create learning experiences that are interactive, practical, and deeply human.</p>
        <ul className="grid md:grid-cols-3 gap-4">
          <li className="p-4 border rounded">Build clarity and confidence around money decisions.</li>
          <li className="p-4 border rounded">Understand how money connects to your goals, behavior, and values.</li>
          <li className="p-4 border rounded">Develop real-world financial skills that last a lifetime.</li>
        </ul>
        <div className="mt-6">
          <a href="#programs" className="px-5 py-2 bg-yellow-400 rounded-full font-semibold">See Our Courses</a>
        </div>
      </div>
    </section>
  )
}
