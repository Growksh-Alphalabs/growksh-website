import React from 'react'

export default function ContactForm() {
  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire up form submission (API / Netlify / serverless)
    const form = new FormData(e.target)
    console.log(Object.fromEntries(form.entries()))
    alert('Thanks — we received your message (demo).')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input name="name" required className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input name="phone" className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">I'm interested in</span>
          <select name="interest" className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50">
            <option>Alphalabs</option>
            <option>Wealthcraft</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Message</span>
        <textarea name="message" rows={6} className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50"></textarea>
      </label>

      <div className="flex items-center gap-4">
        <button type="submit" className="inline-flex items-center gap-2 bg-[#00674F] text-white px-5 py-2 rounded-lg shadow-sm hover:bg-[#005e48] focus:outline-none focus:ring-2 focus:ring-[#00674F]/40">
          Schedule My Call
        </button>
        <span className="text-sm text-slate-600">Or email us at <a href="mailto:hello@growksh.com" className="text-[#00674F] underline">hello@growksh.com</a></span>
      </div>
    </form>
  )
}
