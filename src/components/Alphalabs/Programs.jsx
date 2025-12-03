import React from 'react'

export default function Programs(){
  return (
    <section id="programs" className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-3xl font-bold mb-4">Our Learning Experiences</h3>
        <p className="text-slate-700 mb-6">Each program at Alphalabs is designed to meet learners where they are — from foundational money skills to advanced financial understanding.</p>

        <div className="space-y-10">
          <article className="bg-white rounded-lg border p-6">
            <h4 className="text-2xl font-bold mb-2">F³ (Financial Fitness for Females)</h4>
            <p className="text-sm text-slate-600 mb-4">Making women Financially Aware. Financially Able. Financially Assured.</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <h5 className="font-semibold">Level 1 — The Awareness Bootcamp</h5>
                <p className="text-sm text-slate-600">Build clarity. Break confusion. Pre-recorded videos, Q&amp;A, worksheets.</p>
                <a href="#" className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded">Enroll in Level 1</a>
              </div>

              <div className="p-4 border rounded">
                <h5 className="font-semibold">Level 2 — The Ability Accelerator</h5>
                <p className="text-sm text-slate-600">From knowing to doing. Coaching videos, templates, live groups.</p>
                <a href="#" className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded">Join Level 2</a>
              </div>

              <div className="p-4 border rounded">
                <h5 className="font-semibold">Level 3 — The Assurance Advantage</h5>
                <p className="text-sm text-slate-600">Expert care for your money. One-on-one consultation & oversight.</p>
                <a href="#" className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded">Apply for Level 3</a>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-700">Why Women Love F³: step-by-step, designed by a woman, builds confidence, lifetime access.</p>
              <a href="#" className="inline-block mt-4 px-6 py-2 bg-yellow-400 rounded-full font-semibold">Join The Awareness Bootcamp Today</a>
            </div>
          </article>

          <article className="bg-white rounded-lg border p-6">
            <h4 className="text-xl font-bold mb-2">Coming Soon: More Learning Programs</h4>
            <p className="text-sm text-slate-600 mb-4">We’re continuously expanding our Alphalabs ecosystem with programs for professionals, students and aspiring finance practitioners.</p>
            <a href="#" className="inline-block px-5 py-2 bg-yellow-400 rounded-full">Join the Waitlist</a>
          </article>
        </div>
      </div>
    </section>
  )
}
