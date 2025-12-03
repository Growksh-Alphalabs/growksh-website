import React from 'react'

export default function Community(){
  return (
    <section id="community" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-black mb-3">Join The Alpha Circle — Our Learning Community</h3>
        <p className="text-slate-700 mb-4">A vibrant, like-minded community of learners who are curious about money, growth, and self-improvement.</p>
        <ul className="text-sm text-slate-600 space-y-2 max-w-xl mx-auto">
          <li>Exclusive invites to free mini-sessions and guest talks</li>
          <li>Access to worksheets, templates, and toolkits</li>
          <li>Networking with educators, professionals, and investors</li>
        </ul>
        <div className="mt-6">
          <a href="#" className="px-6 py-2 bg-[#ffde21] text-black rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffde21]">Join The Alpha Circle</a>
        </div>
      </div>
    </section>
  )
}
