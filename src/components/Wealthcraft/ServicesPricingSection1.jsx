import React, { useState } from 'react'
import { model1 } from './servicesData'
import { Link } from 'react-router-dom'

export default function ServicesPricingSection1() {
  const [expandedCategories, setExpandedCategories] = useState({})
  const [expandedServices, setExpandedServices] = useState({})

  // Helper to parse currency like '₹ 14,999' and return formatted full and half prices
  const formatPrices = (priceStr) => {
    if (!priceStr) return { full: '', half: '' }
    const num = Number(String(priceStr).replace(/[^0-9.-]/g, '')) || 0
    const fmt = (n) => n.toLocaleString('en-IN')
    return { full: `₹ ${fmt(num)}`, half: `₹ ${fmt(Math.floor(num / 2))}` }
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const toggleService = (category, serviceIndex) => {
    setExpandedServices(prev => {
      const key = `${category}-${serviceIndex}`
      return {
        ...prev,
        [key]: !prev[key]
      }
    })
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-sm font-medium text-[#ffde21] mb-4 tracking-wider uppercase animate-fade-in">
          Service Models & Pricing Structure
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
          Choose How You'd Like to Work With Us
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
          We understand every individual's financial needs are unique. Some prefer focused consultations; others value year-round partnership and proactive review.
        </p>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
          That's why we designed two flexible engagement models — so you choose what fits your lifestyle, goals, and comfort.
        </p>
      </div>

      {/* Section 1: Pay As You Go vs Pro Plan */}
      <div className="mb-16">
        <div className="relative">
          <div className="bg-gradient-to-r from-[#ffde21] to-white rounded-2xl p-4 shadow-md border border-[#ffde21] mb-6 md:sticky md:top-20 md:z-30 overflow-visible">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              <div className="md:w-2/5 flex items-start">
                <div className="px-3 py-2">
                  <h3 className="text-xl font-bold text-black mb-2">
                    Pay As You Go vs. Pro Plan
                    <span className="block text-lg font-normal">(50% Off)</span>
                  </h3>
                  <p className="text-sm text-slate-700">Choose between one-time services or save 50% with our Pro Plan subscription</p>
                </div>
              </div>

               <div className="md:w-3/5 flex items-center justify-center md:justify-end px-0 py-2">
                  {/* Mobile layout - stacked cards */}
                  <div className="flex flex-col md:hidden w-full gap-4">
                    <div className="flex gap-4 w-full">
                      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl w-1/2">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-black mb-2 text-center">AD HOC</div>
                        <div className="text-sm font-semibold text-slate-900">Pay As You Go</div>
                        <div className="text-xs text-slate-500 mt-1">For those with one time support</div>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl w-1/2">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-black bg-[#ffde21] mb-2 text-center">PRO</div>
                        <div className="text-sm font-semibold text-slate-900">₹999 <span className="text-xs text-slate-500">/Year</span></div>
                        <div className="text-xs text-slate-500 mt-1">For those with ongoing support</div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout - side by side */}
                  <div className="hidden md:flex items-center gap-24 w-full md:w-auto mr-12">
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl w-48">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-black mb-2 text-center">AD HOC</div>
                      <div className="text-sm font-semibold text-slate-900">Pay As You Go</div>
                      <div className="text-xs text-slate-500">For those with one time support</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl w-48">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-black bg-[#ffde21] mb-2 text-center">PRO</div>
                      <div className="text-sm font-semibold text-slate-900">₹999 <span className="text-xs text-slate-500">/Year</span></div>
                      <div className="text-xs text-slate-500">For those with ongoing support</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Services Table - All categories collapsible */}
        <div className="space-y-2">
          {model1.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-lg border border-[#ffde21]/20 overflow-hidden">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full bg-[#ffde21]/10 p-4 border-b border-[#ffde21]/30 text-left hover:bg-[#ffde21]/20 transition-colors"
              >
                <div className="grid grid-cols-12 items-center w-full gap-4">
                  <div className="col-span-12 md:col-span-6 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black">{category.category}</h3>
                      {category.description && (
                        <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                      )}
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 text-slate-600 transform transition-transform duration-200 ${expandedCategories[category.category] ? 'rotate-180' : 'rotate-0'}`}
                        aria-hidden="true"
                      >
                        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="col-span-12 md:hidden mt-3">
                    <div className="flex justify-center gap-3">
                      <div className="bg-white p-3 rounded-lg border border-[#ffde21]/30 text-center w-32">
                        <div className="text-sm font-bold text-black">{formatPrices(category.packagePrice).full}</div>
                        <div className="text-xs text-slate-500 mt-1">AD HOC</div>
                      </div>
                      <div className="bg-[#ffde21]/10 p-3 rounded-lg border-2 border-[#ffde21]/40 text-center w-32">
                        <div className="text-sm font-bold text-black">{formatPrices(category.packagePrice).half}</div>
                        <div className="text-xs text-slate-500 mt-1">PRO</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex col-span-6 items_center justify-end">
                    <div className="flex gap-24 mr-12">
                      <div className="w-48 text-center">
                        <div className="bg-white p-3 rounded-lg border border-[#ffde21]/30">
                          <div className="text-sm font-bold text-black">{formatPrices(category.packagePrice).full}</div>
                        </div>
                      </div>

                      <div className="w-48 text-center">
                        <div className="bg-[#ffde21]/10 p-3 rounded-lg border-2 border-[#ffde21]/40">
                          <div className="text-sm font-bold text-black">{formatPrices(category.packagePrice).half}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {expandedCategories[category.category] && (
                <div className="animate-slide-down">
                  <div className="divide-y divide-slate-100">
                    {category.items.map((service, serviceIndex) => {
                      const serviceKey = `${category.category}-${serviceIndex}`
                      return (
                        <div key={serviceIndex} className="hover:bg-slate-50/50 transition-colors">
                          <div className="grid grid-cols-12 p-4 items-center">
                            <div className="col-span-12 md:col-span-6">
                              <div className="flex items-start gap-3">
                                <div>
                                  <h4 className="font-medium text-slate-900">{service[0]}</h4>
                                  {service[1] && <p className="text-sm text-slate-500 mt-1">{service[1]}</p>}
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12 md:hidden mt-3">
                              <div className="flex justify-center gap-3">
                                <div className="flex flex-col items-center w-32">
                                  <div className="font-semibold text-slate-700">{service[2]}</div>
                                  <div className="text-xs text-slate-500 mt-1">AD HOC</div>
                                </div>

                                <div className="flex flex-col items-center w-32">
                                  <div className="font-bold text-[#ffde21]">{service[3]}</div>
                                  <div className="text-xs text-slate-500 line-through">{service[2]}</div>
                                  <div className="text-xs font-medium text-[#ffde21] mt-1">PRO</div>
                                </div>
                              </div>
                            </div>

                            <div className="hidden md:flex col-span-6 items-center justify-end">
                              <div className="flex gap-24 mr-12">
                                <div className="w-48 text-center">
                                  <div className="font-semibold text-slate-700">{service[2]}</div>
                                </div>

                                <div className="w-48 text-center">
                                  <div className="font-bold text-[#ffde21]">{service[3]}</div>
                                  <div className="text-xs text-slate-500 line-through">{service[2]}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-4xl bg-gradient-to-r from-[#ffde21] to-[#ffde21]/90 rounded-2xl p-8 text-center text-white shadow-lg mt-8">
          <div className="mx-auto">
            <h4 className="text-2xl font-bold mb-3">Unsure what you need? Let's talk.</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="#ad-hoc-consultation"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#000] rounded-full font-bold text-lg hover:-translate-y-1 transition-transform duration-300 shadow-lg"
              >
                Book a Discovery Call
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
