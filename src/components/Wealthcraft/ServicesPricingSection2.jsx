import React from 'react'
import { model2Bundles } from './servicesData'

export default function ServicesPricingSection2() {
    const openCalendly = async (e) => {
        e && e.preventDefault && e.preventDefault()
        const base = 'https://calendly.com/financialfitnessbygrowksh/financial-fitness-discussion'

        const loadCalendlyScript = () => new Promise((resolve, reject) => {
            if (window.Calendly) return resolve()
            const s = document.createElement('script')
            s.src = 'https://assets.calendly.com/assets/external/widget.js'
            s.async = true
            s.onload = () => resolve()
            s.onerror = () => reject(new Error('Calendly script failed to load'))
            document.body.appendChild(s)
        })

        try {
            const calendlyModule = await import('react-calendly').catch(() => null)
            if (calendlyModule && typeof calendlyModule.openPopupWidget === 'function') {
                calendlyModule.openPopupWidget({ url: base })
                return
            }

            if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                window.Calendly.initPopupWidget({ url: base })
                return
            }

            await loadCalendlyScript()
            if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                window.Calendly.initPopupWidget({ url: base })
                return
            }

            window.open(base, '_blank', 'noopener,noreferrer')
        } catch (err) {
            console.warn('Calendly open failed', err)
            window.open(base, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <>
            {/* Section 2: Get More for Less - Bundles */}
            {/* Section 2: Get More for Less - Bundles */}
            <div className="mb-16">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">For Clients Who Want Ongoing Partnership & Long-Term Clarity</h3>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        If you want structured support, periodic reviews, and continuous guidance as your life
                        evolves, our retainer plans give you deeper access and better savings.
                        Choose the level of support that fits your goals:
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                    {/* Essential Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="p-6 text-center">
                            <div className="mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">Essential</h4>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline justify-center gap-4">
                                    <span className="text-lg text-slate-500 line-through">₹14,999</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-slate-900">₹9,999</span>
                                        <span className="text-sm font-medium text-slate-500">/year</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 mt-2">• Pause/Cancel anytime</div>
                            </div>

                            <button className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors duration-300 mb-8">
                                SELECT PLAN
                            </button>

                            <div className="space-y-3 text-left">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Any 2 components</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">3 months association</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Only CFP team support</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Monthly Educational Sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">Personal sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">No discount on further services</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">No carry forward</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">Comprehensive financial plan</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">Review sessions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Card */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-[#ffde21] overflow-visible transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                            <div className="bg-[#ffde21] text-black text-xs font-bold px-4 py-1 rounded-full">
                                POPULAR
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <div className="mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">Advanced</h4>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline justify-center gap-4">
                                    <span className="text-lg text-slate-500 line-through">₹17,999</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-slate-900">₹12,999</span>
                                        <span className="text-sm font-medium text-slate-500">/year</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 mt-2">• Pause/Cancel anytime</div>
                            </div>

                            <button className="w-full py-3 bg-[#ffde21] text-black font-semibold rounded-lg hover:bg-[#e6c81e] transition-colors duration-300 mb-8">
                                SELECT PLAN
                            </button>

                            <div className="space-y-3 text-left">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Any 4 components</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">8 months association</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">CFP + any 1 service provider</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Monthly Educational Sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">2 Personal sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">2 Review Sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">15% discount on further services</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">1 time Carry Forward</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">Reminders about important dates & renewals</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-500">Comprehensive financial plan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premier Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="p-6 text-center">
                            <div className="mb-6">
                                <h4 className="text-2xl font-bold text-slate-900">Premier</h4>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline justify-center gap-4">
                                    <span className="text-lg text-slate-500 line-through">₹25,999</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-slate-900">₹18,999</span>
                                        <span className="text-sm font-medium text-slate-500">/year</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 mt-2">• Pause/Cancel anytime</div>
                            </div>

                            <button className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors duration-300 mb-8">
                                SELECT PLAN
                            </button>

                            <div className="space-y-3 text-left">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">All components included</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">12 months association</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">CFP + full team of service providers</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Monthly Educational Sessions</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Personal sessions every month</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Review Sessions every quarter</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">20% discount on further services</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">2 times Carry Forward</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Reminders about important dates & renewals, goal achievement</span>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700">Comprehensive financial plan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section CTA */}
            <div className="mx-auto max-w-4xl bg-gradient-to-r from-[#ffde21] to-[#ffde21]/90 rounded-2xl p-8 text-center text-slate-900 shadow-lg mt-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h5 className="font-bold text-slate-900 text-2xl mb-4">Still unsure which option fits you best?</h5>
                    <p className="text-lg text-slate-600 mb-6">
                        Book a free 15-minute discovery call and we'll help you decide which approach works best for your needs.
                    </p>
                    <div className="space-y-4">
                        <a
                            href="https://calendly.com/financialfitnessbygrowksh/financial-fitness-discussion"
                            onClick={openCalendly}
                            className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-[#ffde21]/20 text-[#000] rounded-full font-bold text-lg hover:bg-purple-50 transition-colors shadow-md"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Schedule a Call
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
