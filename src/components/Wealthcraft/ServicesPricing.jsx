import React, { useState } from 'react'
import { COLORS } from '../../constants/colors'
import { Link } from 'react-router-dom'

// Model 1: Pay As You Go & Pro Plans (Half Price)
const model1 = [
  {
    category: 'Cashflow Management',
    description: 'Understand, optimize, and manage your money flow effectively.',
    packagePrice: '₹ 14,999',
    items: [
      ['Financial Health Checkup (Net Worth, Cashflow)', 'One-time diagnostic of assets, liabilities & monthly flows', '₹ 3,499', '₹ 1,749'],
      ['Budgeting (Creation & Evaluation)', 'Creating and reviewing a personalized budget framework', '₹ 2,999', '₹ 1,499'],
      ['Financial Analysis (Net Worth / Cashflow / Ratio / SWOT)', 'In-depth analysis with ratio interpretation', '₹ 4,999', '₹ 2,499'],
      ['Cashflow Demands & Conflicts', 'Identifying lifestyle expense clashes, funding gaps', '₹ 2,499', '₹ 1,249'],
      ['Income Generation Strategies', 'Optimizing salary, side income & passive cashflow ideas', '₹ 3,999', '₹ 1,999'],
      ['Debt & Financial Alternatives', 'Loan optimization, credit card strategy, rent vs buy decision', '₹ 4,499', '₹ 2,249'],
      ['Cashflow Management Strategies', 'Tailored structure to optimize spends, savings, and surplus', '₹ 3,999', '₹ 1,999'],
      ['Short-term Liquidity Management', 'Balancing liquidity vs returns for near-term needs', '₹ 2,999', '₹ 1,499']
    ]
  },
  {
    category: 'Investment Planning',
    description: 'Invest smartly, systematically, and in alignment with your goals and risk profile.',
    packagePrice: '₹ 24,999',
    items: [
      ['Risk Profiling & Investor Personality Assessment', 'Behavioural & risk-tolerance mapping', '₹ 2,999', '₹ 1,499'],
      ['Goal-based Investing', 'Linking life goals with investment strategies', '₹ 4,999', '₹ 2,499'],
      ['Emergency Fund Planning', 'Calculating & structuring emergency corpus', '₹ 2,499', '₹ 1,249'],
      ['Investment Suitability Analysis', 'Reviewing if current products fit your goals', '₹ 3,499', '₹ 1,749'],
      ['Investment Portfolio Review & Gap Analysis', 'Deep-dive portfolio audit', '₹ 6,499', '₹ 3,249'],
      ['Portfolio Rebalancing', 'Action plan for reallocation', '₹ 3,999', '₹ 1,999'],
      ['Asset Allocation & Diversification Strategy', 'Customized mix based on risk-return', '₹ 4,499', '₹ 2,249'],
      ['Wealth Creation Plan', '10–15 year wealth roadmap', '₹ 6,999', '₹ 3,499'],
      ['Child Education Planning', 'Future value projections + investment roadmap', '₹ 3,999', '₹ 1,999'],
      ['Vacation Planning', 'Goal budgeting & investment options', '₹ 2,499', '₹ 1,249'],
      ['Home Purchase Planning', 'Buy vs rent, affordability, funding structure', '₹ 3,499', '₹ 1,749'],
      ['Car Purchase Planning', 'Cost-benefit, depreciation & funding advice', '₹ 1,999', '₹ 999'],
      ['Mutual Fund Scheme Recommendation (Category-wise)', 'Fund category analysis with shortlist', '₹ 2,999', '₹ 1,499'],
      ['Investment Platform Guidance', 'Help with choosing & using platforms', '₹ 1,999', '₹ 999']
    ]
  },
  {
    category: 'Tax Planning',
    description: 'Reduce tax liability legally and optimize income post-tax.',
    packagePrice: '₹ 14,999',
    items: [
      ['Annual Tax Filing', 'Coordinating documentation & filing via CA partner', '₹ 2,499', '₹ 1,249'],
      ['Tax Planning & Optimization Strategies', 'Structuring income to minimize taxes', '₹ 4,999', '₹ 2,499'],
      ['Taxation – Income from Salary', 'Salary structuring & exemptions', '₹ 1,999', '₹ 999'],
      ['Taxation – Income from House Property', 'Deductions, interest claims, co-ownership', '₹ 1,999', '₹ 999'],
      ['Taxation – Income from Capital Gains', 'Long/short term, set-off strategies', '₹ 2,499', '₹ 1,249'],
      ['Taxation – Income from Other Sources', 'Interest, gifts, etc.', '₹ 1,499', '₹ 749'],
      ['Computation of Taxable Income', 'Consolidated computation & proof sheet', '₹ 2,499', '₹ 1,249'],
      ['Tax Projection for Next Year', 'Forecasting taxable income', '₹ 2,999', '₹ 1,499'],
      ['Review of Previous Filings for Missed Benefits', 'Audit of prior returns', '₹ 2,999', '₹ 1,499']
    ]
  },
  {
    category: 'Risk Management',
    description: 'Protect your wealth, income, and loved ones from unforeseen risks.',
    packagePrice: '₹ 19,999',
    items: [
      ['Risk Management Audit', 'Full coverage gap analysis', '₹ 3,499', '₹ 1,749'],
      ['Product Suitability & Optimization', 'Fitment check on existing policies', '₹ 2,999', '₹ 1,499'],
      ['Existing Insurance Analysis', 'Deep review of policies', '₹ 3,499', '₹ 1,749'],
      ['Insurance Need Assessment', 'Ideal coverage calculations', '₹ 2,499', '₹ 1,249'],
      ['Risk Management Strategy', 'End-to-end protection plan', '₹ 3,999', '₹ 1,999'],
      ['Insurance Planning', 'Integrated insurance roadmap', '₹ 4,499', '₹ 2,249'],
      ['Health Insurance', 'Product recommendation & structure', '₹ 2,999', '₹ 1,499'],
      ['Life Insurance', 'Term insurance evaluation', '₹ 2,499', '₹ 1,249'],
      ['Motor Insurance', 'Policy selection & advice', '₹ 999', '₹ 499'],
      ['Home Insurance', 'Coverage structure & benefits', '₹ 999', '₹ 499'],
      ['Disability/Critical Illness Insurance', 'Gap evaluation & recommendation', '₹ 1,999', '₹ 999'],
      ['Family Risk Audit Summary Report', 'Consolidated risk report', '₹ 2,499', '₹ 1,249'],
      ['Employer Benefit Optimization', 'Maximizing company-offered insurance & benefits', '₹ 1,999', '₹ 999']
    ]
  },
  {
    category: 'Retirement Planning',
    description: 'Achieve financial independence and security in retirement.',
    packagePrice: '₹ 18,999',
    items: [
      ['Retirement Goals & Objectives', 'Future vision & goal alignment', '₹ 2,499', '₹ 1,249'],
      ['Retirement Needs Analysis', 'Corpus required + gap identification', '₹ 3,999', '₹ 1,999'],
      ['Projection of Corpus & Cashflow', 'Detailed Excel model with inflation', '₹ 4,999', '₹ 2,499'],
      ['Retirement Income Strategy', 'Systematic withdrawal & tax planning', '₹ 3,499', '₹ 1,749'],
      ['Withdrawal Strategy & Tax Efficiency', 'SWP, annuity, tax optimization', '₹ 2,999', '₹ 1,499'],
      ['Suitability of Retirement Products', 'EPF, NPS, Pension, Annuities, etc.', '₹ 2,499', '₹ 1,249'],
      ['Pension / Superannuation Benefit Analysis', 'Review & optimization', '₹ 1,999', '₹ 999'],
      ['Post-Retirement Investment Plan', 'Creating a passive income plan', '₹ 3,999', '₹ 1,999'],
      ['Lifestyle Cost Analysis', 'Inflation-adjusted expense projections', '₹ 2,499', '₹ 1,249']
    ]
  },
  {
    category: 'Estate Planning',
    description: 'Secure your legacy and ensure smooth transition of assets.',
    packagePrice: '₹ 22,999',
    items: [
      ['Estate Planning Strategies', 'Structuring asset distribution', '₹ 3,999', '₹ 1,999'],
      ['Succession & Inheritance Planning', 'Legal & practical framework', '₹ 3,999', '₹ 1,999'],
      ['Will Creation', 'Drafting & guidance via legal partner', '₹ 4,999', '₹ 2,499'],
      ['Trust Setup', 'Planning & documentation with lawyer', '₹ 6,499', '₹ 3,249'],
      ['Hindu Undivided Family (HUF) Planning', 'Tax & legacy optimization', '₹ 2,999', '₹ 1,499'],
      ['Planning for Incapacity', 'Nomination, POA, healthcare directives', '₹ 2,499', '₹ 1,249'],
      ['Joint Ownership Structure Review', 'Property & asset titling analysis', '₹ 2,499', '₹ 1,249'],
      ['Estate Liquidity Planning', 'Ensuring immediate access to funds post demise', '₹ 2,999', '₹ 1,499']
    ]
  },
  {
    category: 'Financial Planning (Comprehensive)',
    description: 'The all-in-one holistic service integrating every aspect of your financial life.',
    packagePrice: '₹ 49,999',
    items: [
      ['Basic 1-Page Plan', 'Snapshot plan with top-line recommendations', '₹ 9,999', '₹ 4,999'],
      ['Comprehensive Planning', 'Full, integrated financial blueprint', '₹ 39,999', '₹ 19,999'],
      ['Goal Setting & Timeline Mapping', 'SMART goals linked to each life stage', '₹ 4,999', '₹ 2,499'],
      ['Review of Existing Financial Plan', 'Third-party plan evaluation', '₹ 3,499', '₹ 1,749'],
      ['Complete Financial Health Analysis', 'End-to-end financial fitness audit', '₹ 5,999', '₹ 2,999']
    ]
  }
]

// Model 2: Get More for Less - Bundles
const model2Bundles = [
  {
    id: 1,
    name: 'Employment Docket',
    description: 'Must have 8 Agreements and 3 Policies for a smooth HR procedure for your business.',
    price: '₹ 30,000',
    originalPrice: '₹ 45,000',
    discount: '33% OFF',
    features: [
      '8 Essential Employment Agreements',
      '3 HR Policies',
      'Legal Compliance Guarantee',
      '1 Year Support'
    ],
    tag: 'BEST SELLER',
    popular: true
  },
  {
    id: 2,
    name: 'International Employment Docket',
    description: 'Must have 8 Agreements and 3 Policies for a smooth HR procedure for your business.',
    price: '₹ 40,000',
    originalPrice: '₹ 60,000',
    discount: '33% OFF',
    features: [
      '8 International Employment Agreements',
      '3 Global HR Policies',
      'Multi-jurisdiction Compliance',
      '1 Year Priority Support'
    ],
    tag: 'INTERNATIONAL'
  },
  {
    id: 3,
    name: 'Indian MSME Legal Bundle',
    description: 'Get 6 must-have contracts designed exclusively for your business at INR 5,000 each.',
    price: '₹ 30,000',
    originalPrice: '₹ 42,000',
    discount: '29% OFF',
    features: [
      '6 Essential Business Contracts',
      'MSME Specific Templates',
      'Legal Advisory Session',
      '6 Months Support'
    ],
    tag: 'FOR SMALL BUSINESS'
  },
  {
    id: 4,
    name: 'International MSME Legal Bundle',
    description: 'Get 4 must-have contracts designed exclusively for your business at INR 10,000 each.',
    price: '₹ 40,000',
    originalPrice: '₹ 56,000',
    discount: '29% OFF',
    features: [
      '4 International Business Contracts',
      'Cross-border Legal Guidance',
      'Export-Import Documentation',
      '6 Months Priority Support'
    ],
    tag: 'GLOBAL BUSINESS'
  }
]

export default function ServicesPricing() {
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

  const expandAllCategories = () => {
    const allExpanded = {}
    model1.forEach(category => {
      if (category && category.category) allExpanded[category.category] = true
    })
    setExpandedCategories(allExpanded)
  }

  const collapseAllCategories = () => {
    setExpandedCategories({})
  }


  return (
    <section id="wealthcraft-pricing" className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
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
          {/* ADHOC and PRO Cards with Price Boxes */}
          <div className="relative">
            {/* Top: ADHOC and PRO cards */}
            <div className="bg-gradient-to-r from-[#ffde21] to-white rounded-2xl p-4 shadow-md border border-[#ffde21] mb-6 md:sticky md:top-20 md:z-30 overflow-visible">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Left description */}
                <div className="md:w-2/5 flex items-start">
                  <div className="px-3 py-2">
                    <h3 className="text-xl font-bold text-black mb-2">
                      Pay As You Go vs. Pro Plan
                      <span className="block text-lg font-normal">(50% Off)</span>
                    </h3>
                    <p className="text-sm text-slate-700">Choose between one-time services or save 50% with our Pro Plan subscription</p>
                  </div>
                </div>

                {/* Right floating cards area */}
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
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full bg-[#ffde21]/10 p-4 border-b border-[#ffde21]/30 text-left hover:bg-[#ffde21]/20 transition-colors"
                >
                  <div className="grid grid-cols-12 items-center w-full gap-4">
                    {/* Left: title */}
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

                    {/* Mobile: Price boxes */}
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

                    {/* Desktop: Price boxes */}
                    <div className="hidden md:flex col-span-6 items-center justify-end">
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

                {/* Category Content */}
                {expandedCategories[category.category] && (
                  <div className="animate-slide-down">
                    <div className="divide-y divide-slate-100">
                      {category.items.map((service, serviceIndex) => {
                        const serviceKey = `${category.category}-${serviceIndex}`
                        const isExpanded = expandedServices[serviceKey] || false

                        return (
                          <div key={serviceIndex} className="hover:bg-slate-50/50 transition-colors">
                            <div className="grid grid-cols-12 p-4 items-center">
                              {/* Service Name */}
                              <div className="col-span-12 md:col-span-6">
                                <div className="flex items-start gap-3">
                                  <div>
                                    <h4 className="font-medium text-slate-900">{service[0]}</h4>
                                    {service[1] && <p className="text-sm text-slate-500 mt-1">{service[1]}</p>}
                                  </div>
                                </div>
                              </div>

                              {/* Mobile: Price boxes */}
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

                              {/* Desktop: Price columns */}
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
              <Link
                to="#schedule"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-[#ffde21]/20 text-[#000] rounded-full font-bold text-lg hover:bg-purple-50 transition-colors shadow-md"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Schedule a Call
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
      .animate-slide-down {
        animation: slideDown 0.3s ease-out forwards;
      }
      
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .animate-slide-up {
        animation: slideUp 0.5s ease-out forwards;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .animate-slide-down,
        .animate-fade-in,
        .animate-slide-up,
        .transition-all,
        .transition-transform,
        .transition-colors {
          animation: none !important;
          transition: none !important;
        }
        .animate-pulse {
          animation: none !important;
        }
      }
    `}</style>
    </section>
  )


}