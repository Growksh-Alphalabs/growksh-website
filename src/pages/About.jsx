import React from 'react'
import CTASection from '../components/CTA/CTASection'

export default function About() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero banner */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-12 text-center text-white shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Your Partner in Financial Growth</h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-200">Growksh is dedicated to demystifying wealth management and empowering you to achieve your financial goals with confidence.</p>
        </div>
      </header>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-center text-slate-900">From Guidance to Growth: Our Story</h2>
        <p className="mt-4 text-center text-slate-600">Growksh was founded by Krutika Kathal with a simple yet powerful mission: to make expert financial guidance accessible to everyone. Frustrated by the complexities and jargon that often intimidate people, Krutika envisioned a firm that prioritizes clarity, trust, and personalized strategies. We believe in building long-term partnerships with our clients, guiding them through every stage of their financial journey with empathy and expertise.</p>
      </section>

      {/* Founder card */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
        <h3 className="text-xl font-semibold text-center">Meet Our Founder</h3>
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img src="/src/assets/placeholder-founder.jpg" alt="Krutika Kathal" className="w-36 h-36 rounded-full object-cover border-4 border-sky-200" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold">Krutika Kathal</h4>
            <div className="text-sm text-rose-400">Founder & CEO</div>
            <p className="mt-4 text-slate-700">With over 15 years in the financial industry, Krutika has dedicated her career to empowering individuals and families. Her passion lies in translating complex market dynamics into actionable strategies that align with her clients' unique dreams and aspirations.</p>

            <blockquote className="mt-4 border-l-4 border-sky-300 pl-4 italic text-slate-600">“Financial empowerment isn't just about numbers; it's about giving you the freedom to live the life you've always imagined.”</blockquote>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-800 text-white p-10 text-center shadow-md">
            <h3 className="text-2xl font-bold">Ready to Start Your Journey?</h3>
            <p className="mt-3 text-slate-200">Let's build a secure and prosperous future together. Schedule a complimentary consultation to discuss your financial goals.</p>
            <div className="mt-6">
              <a href="/contact" className="inline-flex items-center px-6 py-3 bg-sky-400 text-slate-900 rounded-md font-semibold">Schedule a Consultation</a>
            </div>
          </div>
        </div>
      </div>

      {/* Reuse CTASection for footer CTA if desired */}
      <CTASection />
    </div>
  )
}
