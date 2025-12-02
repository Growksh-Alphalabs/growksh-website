import React, { useState, useEffect } from 'react'
import { COLORS } from '../../constants/colors'

const model1 = [
  {
    category: 'Cashflow Management',
    packagePrice: '₹ 14,999',
    items: [
      ['Financial Health Checkup (Net Worth, Cashflow)', 'One-time diagnostic of assets, liabilities & monthly flows', '₹ 3,499'],
      ['Budgeting (Creation & Evaluation)', 'Creating and reviewing a personalized budget framework', '₹ 2,999'],
      ['Financial Analysis (Net Worth / Cashflow / Ratio / SWOT)', 'In-depth analysis with ratio interpretation', '₹ 4,999'],
      ['Cashflow Demands & Conflicts', 'Identifying lifestyle expense clashes, funding gaps', '₹ 2,499'],
      ['Income Generation Strategies', 'Optimizing salary, side income & passive cashflow ideas', '₹ 3,999'],
      ['Debt & Financial Alternatives', 'Loan optimization, credit card strategy, rent vs buy decision', '₹ 4,499'],
      ['Cashflow Management Strategies', 'Tailored structure to optimize spends, savings, and surplus', '₹ 3,999'],
      ['Short-term Liquidity Management', 'Balancing liquidity vs returns for near-term needs', '₹ 2,999']
    ]
  },
  {
    category: 'Investment Planning',
    packagePrice: '₹ 24,999',
    items: [
      ['Risk Profiling & Investor Personality Assessment', 'Behavioural & risk-tolerance mapping', '₹ 2,999'],
      ['Goal-based Investing', 'Linking life goals with investment strategies', '₹ 4,999'],
      ['Emergency Fund Planning', 'Calculating & structuring emergency corpus', '₹ 2,499'],
      ['Investment Suitability Analysis', 'Reviewing if current products fit your goals', '₹ 3,499'],
      ['Investment Portfolio Review & Gap Analysis', 'Deep-dive portfolio audit', '₹ 6,499'],
      ['Portfolio Rebalancing', 'Action plan for reallocation', '₹ 3,999'],
      ['Asset Allocation & Diversification Strategy', 'Customized mix based on risk-return', '₹ 4,499'],
      ['Wealth Creation Plan', '10–15 year wealth roadmap', '₹ 6,999'],
      ['Child Education Planning', 'Future value projections + investment roadmap', '₹ 3,999'],
      ['Vacation Planning', 'Goal budgeting & investment options', '₹ 2,499'],
      ['Home Purchase Planning', 'Buy vs rent, affordability, funding structure', '₹ 3,499'],
      ['Car Purchase Planning', 'Cost-benefit, depreciation & funding advice', '₹ 1,999'],
      ['Mutual Fund Scheme Recommendation (Category-wise)', 'Fund category analysis with shortlist', '₹ 2,999'],
      ['Investment Platform Guidance', 'Help with choosing & using platforms', '₹ 1,999']
    ]
  },
  {
    category: 'Tax Planning',
    packagePrice: '₹ 14,999',
    items: [
      ['Annual Tax Filing', 'Coordinating documentation & filing via CA partner', '₹ 2,499'],
      ['Tax Planning & Optimization Strategies', 'Structuring income to minimize taxes', '₹ 4,999'],
      ['Taxation – Income from Salary', 'Salary structuring & exemptions', '₹ 1,999'],
      ['Taxation – Income from House Property', 'Deductions, interest claims, co-ownership', '₹ 1,999'],
      ['Taxation – Income from Capital Gains', 'Long/short term, set-off strategies', '₹ 2,499'],
      ['Taxation – Income from Other Sources', 'Interest, gifts, etc.', '₹ 1,499'],
      ['Computation of Taxable Income', 'Consolidated computation & proof sheet', '₹ 2,499'],
      ['Tax Projection for Next Year', 'Forecasting taxable income', '₹ 2,999'],
      ['Review of Previous Filings for Missed Benefits', 'Audit of prior returns', '₹ 2,999']
    ]
  },
  {
    category: 'Risk Management',
    packagePrice: '₹ 19,999',
    items: [
      ['Risk Management Audit', 'Full coverage gap analysis', '₹ 3,499'],
      ['Product Suitability & Optimization', 'Fitment check on existing policies', '₹ 2,999'],
      ['Existing Insurance Analysis', 'Deep review of policies', '₹ 3,499'],
      ['Insurance Need Assessment', 'Ideal coverage calculations', '₹ 2,499'],
      ['Risk Management Strategy', 'End-to-end protection plan', '₹ 3,999'],
      ['Insurance Planning', 'Integrated insurance roadmap', '₹ 4,499'],
      ['Health Insurance', 'Product recommendation & structure', '₹ 2,999'],
      ['Life Insurance', 'Term insurance evaluation', '₹ 2,499'],
      ['Motor Insurance', 'Policy selection & advice', '₹ 999'],
      ['Home Insurance', 'Coverage structure & benefits', '₹ 999'],
      ['Disability/Critical Illness Insurance', 'Gap evaluation & recommendation', '₹ 1,999'],
      ['Family Risk Audit Summary Report', 'Consolidated risk report', '₹ 2,499'],
      ['Employer Benefit Optimization', 'Maximizing company-offered insurance & benefits', '₹ 1,999']
    ]
  },
  {
    category: 'Retirement Planning',
    packagePrice: '₹ 18,999',
    items: [
      ['Retirement Goals & Objectives', 'Future vision & goal alignment', '₹ 2,499'],
      ['Retirement Needs Analysis', 'Corpus required + gap identification', '₹ 3,999'],
      ['Projection of Corpus & Cashflow', 'Detailed Excel model with inflation', '₹ 4,999'],
      ['Retirement Income Strategy', 'Systematic withdrawal & tax planning', '₹ 3,499'],
      ['Withdrawal Strategy & Tax Efficiency', 'SWP, annuity, tax optimization', '₹ 2,999'],
      ['Suitability of Retirement Products', 'EPF, NPS, Pension, Annuities, etc.', '₹ 2,499'],
      ['Pension / Superannuation Benefit Analysis', 'Review & optimization', '₹ 1,999'],
      ['Post-Retirement Investment Plan', 'Creating a passive income plan', '₹ 3,999'],
      ['Lifestyle Cost Analysis', 'Inflation-adjusted expense projections', '₹ 2,499']
    ]
  },
  {
    category: 'Estate Planning',
    packagePrice: '₹ 22,999',
    items: [
      ['Estate Planning Strategies', 'Structuring asset distribution', '₹ 3,999'],
      ['Succession & Inheritance Planning', 'Legal & practical framework', '₹ 3,999'],
      ['Will Creation', 'Drafting & guidance via legal partner', '₹ 4,999'],
      ['Trust Setup', 'Planning & documentation with lawyer', '₹ 6,499'],
      ['Hindu Undivided Family (HUF) Planning', 'Tax & legacy optimization', '₹ 2,999'],
      ['Planning for Incapacity', 'Nomination, POA, healthcare directives', '₹ 2,499'],
      ['Joint Ownership Structure Review', 'Property & asset titling analysis', '₹ 2,499'],
      ['Estate Liquidity Planning', 'Ensuring immediate access to funds post demise', '₹ 2,999']
    ]
  },
  {
    category: 'Financial Planning (Comprehensive)',
    packagePrice: '₹ 49,999',
    items: [
      ['Basic 1-Page Plan', 'Snapshot plan with top-line recommendations', '₹ 9,999'],
      ['Comprehensive Planning', 'Full, integrated financial blueprint', '₹ 39,999'],
      ['Goal Setting & Timeline Mapping', 'SMART goals linked to each life stage', '₹ 4,999'],
      ['Review of Existing Financial Plan', 'Third-party plan evaluation', '₹ 3,499'],
      ['Complete Financial Health Analysis', 'End-to-end financial fitness audit', '₹ 5,999']
    ]
  }
]

// Model 2: Retainer Plans
const model2Plans = [
  {
    name: 'Silver Plan',
    price: '₹ 9,999 / quarter',
    features: [
      'Quarterly financial review',
      'Email support with 48-hour response',
      'Basic portfolio monitoring',
      'Annual tax planning session',
      'Access to educational resources'
    ]
  },
  {
    name: 'Gold Plan',
    price: '₹ 18,999 / quarter',
    features: [
      'Monthly financial check-ins',
      'Priority email & chat support',
      'Comprehensive portfolio management',
      'Tax optimization strategies',
      'Goal tracking dashboard',
      'Annual estate plan review',
      '2 emergency consultation slots'
    ]
  },
  {
    name: 'Platinum Plan',
    price: '₹ 29,999 / quarter',
    features: [
      'Weekly financial monitoring',
      '24/7 priority phone support',
      'Full financial planning suite',
      'Advanced tax planning',
      'Legacy & estate planning',
      'Business succession planning',
      'Unlimited consultation slots',
      'Dedicated financial advisor',
      'Family financial planning'
    ]
  }
]

export default function ServicesPricing() {
  const [expandedCategories, setExpandedCategories] = useState({})
  const [expandedServices, setExpandedServices] = useState({})
  const [expandedModel2, setExpandedModel2] = useState({})
  const [activeModel, setActiveModel] = useState(1)

  // Expand first category by default
  useEffect(() => {
    if (Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [model1[0].category]: true })
    }
  }, [])

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

  const toggleModel2Plan = (planIndex) => {
    setExpandedModel2(prev => ({
      ...prev,
      [planIndex]: !prev[planIndex]
    }))
  }

  const expandAllCategories = () => {
    const allExpanded = {}
    model1.forEach(category => {
      allExpanded[category.category] = true
    })
    setExpandedCategories(allExpanded)
  }

  const collapseAllCategories = () => {
    setExpandedCategories({})
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-emerald-700 mb-4 tracking-wider uppercase animate-fade-in">
            Service Models & Pricing Structure
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Choose How You'd Like to Work With Us
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            We understand every individual's financial needs are unique. Some prefer focused consultations; others value year-round partnership and proactive review. That's why we designed two flexible engagement models — so you choose what fits your lifestyle, goals, and comfort.
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveModel(1)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeModel === 1 
              ? 'bg-emerald-600 text-white shadow-lg transform scale-105' 
              : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-50'}`}
          >
            🔸 Model 1: Ad-Hoc Consultation
          </button>
          <button
            onClick={() => setActiveModel(2)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeModel === 2 
              ? 'bg-emerald-600 text-white shadow-lg transform scale-105' 
              : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-50'}`}
          >
            🔹 Model 2: Retainer Plans
          </button>
        </div>

        {/* Control Buttons for Model 1 */}
        {activeModel === 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={expandAllCategories}
              className="px-4 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
            >
              Expand All Categories
            </button>
            <button
              onClick={collapseAllCategories}
              className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              Collapse All Categories
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Model 1 details */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-500 ${activeModel === 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            {activeModel === 1 && (
              <>
                <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">🔸 MODEL 1: Ad-Hoc Consultation — Pay As You Need</h3>
                      <p className="text-slate-700 mt-2">
                        <strong>Best For:</strong> Individuals who want focused help on a specific financial area or need expert advice for one-time planning decisions.
                      </p>
                    </div>
                    <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-full border border-emerald-200">
                      Unsure what you need? <a href="#adhoc" className="text-emerald-600 font-medium hover:underline">Book an Ad-hoc Consultation</a>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                    <strong>How It Works:</strong> Choose any single component or sub-component (from Cashflow, Investments, Tax, Risk, Retirement, Estate Planning). Pay the respective service fee once. Get a personalized report, actionable insights, and 1 Zoom consultation with our Planning Advisor.
                  </div>
                </div>

                {/* Main Accordion for Model 1 */}
                <div className="space-y-4">
                  {model1.map((category, catIndex) => (
                    <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.category)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-emerald-50/50 transition-colors"
                        aria-expanded={expandedCategories[category.category] || false}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${expandedCategories[category.category] ? 'bg-emerald-100 text-emerald-700 rotate-90' : 'bg-slate-100 text-slate-600'}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-slate-900">{category.category}</h4>
                              <p className="text-sm text-slate-600">Package starting at</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-emerald-700">{category.packagePrice}</span>
                          <span className="text-slate-400">
                            {expandedCategories[category.category] ? '−' : '+'}
                          </span>
                        </div>
                      </button>

                      {/* Category Content */}
                      {expandedCategories[category.category] && (
                        <div className="px-5 pb-5 animate-slide-down">
                          <div className="pl-11 space-y-3">
                            {category.items.map((service, serviceIndex) => {
                              const serviceKey = `${category.category}-${serviceIndex}`
                              return (
                                <div key={serviceIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                                  {/* Service Header */}
                                  <button
                                    onClick={() => toggleService(category.category, serviceIndex)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                    aria-expanded={expandedServices[serviceKey] || false}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${expandedServices[serviceKey] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-slate-900">{service[0]}</h5>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="font-semibold text-slate-800">{service[2]}</span>
                                      <span className="text-slate-400">
                                        {expandedServices[serviceKey] ? '−' : '+'}
                                      </span>
                                    </div>
                                  </button>

                                  {/* Service Description */}
                                  {expandedServices[serviceKey] && (
                                    <div className="px-4 pb-4 pl-14 animate-slide-down">
                                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                        {service[1]}
                                      </div>
                                      <div className="mt-3 flex justify-end">
                                        <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                                          Select Service
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA Below Table */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-lg">
                  <h4 className="text-xl font-bold mb-3">Unsure what you need? Let's talk.</h4>
                  <p className="mb-6 opacity-90">Book a personalized consultation to discuss your specific requirements</p>
                  <a
                    href="#book-consultation"
                    className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    Book an Ad-hoc Consultation
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Right: Model 2 / summary column */}
          <div className={`space-y-6 transition-all duration-500 ${activeModel === 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            {activeModel === 2 && (
              <>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">🔹 MODEL 2: Retainer Plans — Stay Partnered, Stay Planned</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-slate-700 mb-2">
                        <strong>Registration Fee:</strong> <span className="font-bold text-blue-600">₹ 999</span> (one-time)
                      </div>
                      <p className="text-sm text-slate-600">
                        Long-term partnership with periodic reviews, priority support, and proactive planning across the year.
                      </p>
                    </div>
                  </div>

                  {/* Model 2 Plans Accordion */}
                  <div className="mt-6 space-y-4">
                    {model2Plans.map((plan, planIndex) => (
                      <div key={planIndex} className="bg-white rounded-xl border border-blue-200 overflow-hidden">
                        <button
                          onClick={() => toggleModel2Plan(planIndex)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-50 transition-colors"
                          aria-expanded={expandedModel2[planIndex] || false}
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{plan.name}</h4>
                            <p className="text-sm text-blue-600 font-semibold">{plan.price}</p>
                          </div>
                          <span className="text-blue-400">
                            {expandedModel2[planIndex] ? '−' : '+'}
                          </span>
                        </button>
                        
                        {expandedModel2[planIndex] && (
                          <div className="px-4 pb-4 animate-slide-down">
                            <ul className="space-y-2">
                              {plan.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-700">
                                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 flex justify-end">
                              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                Select Plan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <a
                      href="#retainer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300"
                    >
                      Join a Retainer Plan
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </>
            )}

            {/* Common CTA */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <h5 className="font-bold text-slate-900 text-lg mb-3">Still unsure which model fits you best?</h5>
              <p className="text-sm text-slate-600 mb-4">
                Book a free 15-minute discovery call and we'll help you decide which approach works best for your financial goals.
              </p>
              <div className="space-y-3">
                <a
                  href="#schedule"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule a Call
                </a>
                <p className="text-xs text-slate-500 text-center">
                  No commitment required • Get personalized recommendations
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h6 className="font-semibold text-slate-900 mb-3">Why Choose Our Services?</h6>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">100%</div>
                  <div className="text-xs text-slate-600">Unbiased Advice</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">15+</div>
                  <div className="text-xs text-slate-600">Years Experience</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">24/7</div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">98%</div>
                  <div className="text-xs text-slate-600">Client Satisfaction</div>
                </div>
              </div>
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
        
        /* Custom scrollbar for service items */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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
        }
      `}</style>
    </section>
  )
}