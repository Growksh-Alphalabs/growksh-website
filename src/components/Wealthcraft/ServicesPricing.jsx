import React, { useState } from 'react'
import { COLORS } from '../../constants/colors'

// Model 1: Pay As You Go & Pro Plans (Half Price)
const model1 = [
    {
        category: 'Cashflow Management',
        description: 'Understand, optimize, and manage your money flow effectively.',
        packagePrice: '₹ 14,999',
        items: [
            ['Financial Health Checkup (Net Worth, Cashflow)', 'One-time diagnostic of assets, liabilities & monthly flows', '₹ 3,499', '₹ 1,750'],
            ['Budgeting (Creation & Evaluation)', 'Creating and reviewing a personalized budget framework', '₹ 2,999', '₹ 1,500'],
            ['Financial Analysis (Net Worth / Cashflow / Ratio / SWOT)', 'In-depth analysis with ratio interpretation', '₹ 4,999', '₹ 2,500'],
            ['Cashflow Demands & Conflicts', 'Identifying lifestyle expense clashes, funding gaps', '₹ 2,499', '₹ 1,250'],
            ['Income Generation Strategies', 'Optimizing salary, side income & passive cashflow ideas', '₹ 3,999', '₹ 2,000'],
            ['Debt & Financial Alternatives', 'Loan optimization, credit card strategy, rent vs buy decision', '₹ 4,499', '₹ 2,250'],
            ['Cashflow Management Strategies', 'Tailored structure to optimize spends, savings, and surplus', '₹ 3,999', '₹ 2,000'],
            ['Short-term Liquidity Management', 'Balancing liquidity vs returns for near-term needs', '₹ 2,999', '₹ 1,500']
        ]
    },
    {
        category: 'Investment Planning',
        description: 'Invest smartly, systematically, and in alignment with your goals and risk profile.',
        packagePrice: '₹ 24,999',
        items: [
            ['Risk Profiling & Investor Personality Assessment', 'Behavioural & risk-tolerance mapping', '₹ 2,999', '₹ 1,500'],
            ['Goal-based Investing', 'Linking life goals with investment strategies', '₹ 4,999', '₹ 2,500'],
            ['Emergency Fund Planning', 'Calculating & structuring emergency corpus', '₹ 2,499', '₹ 1,250'],
            ['Investment Suitability Analysis', 'Reviewing if current products fit your goals', '₹ 3,499', '₹ 1,750'],
            ['Investment Portfolio Review & Gap Analysis', 'Deep-dive portfolio audit', '₹ 6,499', '₹ 3,250'],
            ['Portfolio Rebalancing', 'Action plan for reallocation', '₹ 3,999', '₹ 2,000'],
            ['Asset Allocation & Diversification Strategy', 'Customized mix based on risk-return', '₹ 4,499', '₹ 2,250'],
            ['Wealth Creation Plan', '10–15 year wealth roadmap', '₹ 6,999', '₹ 3,500'],
            ['Child Education Planning', 'Future value projections + investment roadmap', '₹ 3,999', '₹ 2,000'],
            ['Vacation Planning', 'Goal budgeting & investment options', '₹ 2,499', '₹ 1,250'],
            ['Home Purchase Planning', 'Buy vs rent, affordability, funding structure', '₹ 3,499', '₹ 1,750'],
            ['Car Purchase Planning', 'Cost-benefit, depreciation & funding advice', '₹ 1,999', '₹ 1,000'],
            ['Mutual Fund Scheme Recommendation (Category-wise)', 'Fund category analysis with shortlist', '₹ 2,999', '₹ 1,500'],
            ['Investment Platform Guidance', 'Help with choosing & using platforms', '₹ 1,999', '₹ 1,000']
        ]
    },
    {
        category: 'Tax Planning',
        description: 'Reduce tax liability legally and optimize income post-tax.',
        packagePrice: '₹ 14,999',
        items: [
            ['Annual Tax Filing', 'Coordinating documentation & filing via CA partner', '₹ 2,499', '₹ 1,250'],
            ['Tax Planning & Optimization Strategies', 'Structuring income to minimize taxes', '₹ 4,999', '₹ 2,500'],
            ['Taxation – Income from Salary', 'Salary structuring & exemptions', '₹ 1,999', '₹ 1,000'],
            ['Taxation – Income from House Property', 'Deductions, interest claims, co-ownership', '₹ 1,999', '₹ 1,000'],
            ['Taxation – Income from Capital Gains', 'Long/short term, set-off strategies', '₹ 2,499', '₹ 1,250'],
            ['Taxation – Income from Other Sources', 'Interest, gifts, etc.', '₹ 1,499', '₹ 750'],
            ['Computation of Taxable Income', 'Consolidated computation & proof sheet', '₹ 2,499', '₹ 1,250'],
            ['Tax Projection for Next Year', 'Forecasting taxable income', '₹ 2,999', '₹ 1,500'],
            ['Review of Previous Filings for Missed Benefits', 'Audit of prior returns', '₹ 2,999', '₹ 1,500']
        ]
    },
    {
        category: 'Risk Management',
        description: 'Protect your wealth, income, and loved ones from unforeseen risks.',
        packagePrice: '₹ 19,999',
        items: [
            ['Risk Management Audit', 'Full coverage gap analysis', '₹ 3,499', '₹ 1,750'],
            ['Product Suitability & Optimization', 'Fitment check on existing policies', '₹ 2,999', '₹ 1,500'],
            ['Existing Insurance Analysis', 'Deep review of policies', '₹ 3,499', '₹ 1,750'],
            ['Insurance Need Assessment', 'Ideal coverage calculations', '₹ 2,499', '₹ 1,250'],
            ['Risk Management Strategy', 'End-to-end protection plan', '₹ 3,999', '₹ 2,000'],
            ['Insurance Planning', 'Integrated insurance roadmap', '₹ 4,499', '₹ 2,250'],
            ['Health Insurance', 'Product recommendation & structure', '₹ 2,999', '₹ 1,500'],
            ['Life Insurance', 'Term insurance evaluation', '₹ 2,499', '₹ 1,250'],
            ['Motor Insurance', 'Policy selection & advice', '₹ 999', '₹ 500'],
            ['Home Insurance', 'Coverage structure & benefits', '₹ 999', '₹ 500'],
            ['Disability/Critical Illness Insurance', 'Gap evaluation & recommendation', '₹ 1,999', '₹ 1,000'],
            ['Family Risk Audit Summary Report', 'Consolidated risk report', '₹ 2,499', '₹ 1,250'],
            ['Employer Benefit Optimization', 'Maximizing company-offered insurance & benefits', '₹ 1,999', '₹ 1,000']
        ]
    },
    {
        category: 'Retirement Planning',
        description: 'Achieve financial independence and security in retirement.',
        packagePrice: '₹ 18,999',
        items: [
            ['Retirement Goals & Objectives', 'Future vision & goal alignment', '₹ 2,499', '₹ 1,250'],
            ['Retirement Needs Analysis', 'Corpus required + gap identification', '₹ 3,999', '₹ 2,000'],
            ['Projection of Corpus & Cashflow', 'Detailed Excel model with inflation', '₹ 4,999', '₹ 2,500'],
            ['Retirement Income Strategy', 'Systematic withdrawal & tax planning', '₹ 3,499', '₹ 1,750'],
            ['Withdrawal Strategy & Tax Efficiency', 'SWP, annuity, tax optimization', '₹ 2,999', '₹ 1,500'],
            ['Suitability of Retirement Products', 'EPF, NPS, Pension, Annuities, etc.', '₹ 2,499', '₹ 1,250'],
            ['Pension / Superannuation Benefit Analysis', 'Review & optimization', '₹ 1,999', '₹ 1,000'],
            ['Post-Retirement Investment Plan', 'Creating a passive income plan', '₹ 3,999', '₹ 2,000'],
            ['Lifestyle Cost Analysis', 'Inflation-adjusted expense projections', '₹ 2,499', '₹ 1,250']
        ]
    },
    {
        category: 'Estate Planning',
        description: 'Secure your legacy and ensure smooth transition of assets.',
        packagePrice: '₹ 22,999',
        items: [
            ['Estate Planning Strategies', 'Structuring asset distribution', '₹ 3,999', '₹ 2,000'],
            ['Succession & Inheritance Planning', 'Legal & practical framework', '₹ 3,999', '₹ 2,000'],
            ['Will Creation', 'Drafting & guidance via legal partner', '₹ 4,999', '₹ 2,500'],
            ['Trust Setup', 'Planning & documentation with lawyer', '₹ 6,499', '₹ 3,250'],
            ['Hindu Undivided Family (HUF) Planning', 'Tax & legacy optimization', '₹ 2,999', '₹ 1,500'],
            ['Planning for Incapacity', 'Nomination, POA, healthcare directives', '₹ 2,499', '₹ 1,250'],
            ['Joint Ownership Structure Review', 'Property & asset titling analysis', '₹ 2,499', '₹ 1,250'],
            ['Estate Liquidity Planning', 'Ensuring immediate access to funds post demise', '₹ 2,999', '₹ 1,500']
        ]
    },
    {
        category: 'Financial Planning (Comprehensive)',
        description: 'The all-in-one holistic service integrating every aspect of your financial life.',
        packagePrice: '₹ 49,999',
        items: [
            ['Basic 1-Page Plan', 'Snapshot plan with top-line recommendations', '₹ 9,999', '₹ 5,000'],
            ['Comprehensive Planning', 'Full, integrated financial blueprint', '₹ 39,999', '₹ 20,000'],
            ['Goal Setting & Timeline Mapping', 'SMART goals linked to each life stage', '₹ 4,999', '₹ 2,500'],
            ['Review of Existing Financial Plan', 'Third-party plan evaluation', '₹ 3,499', '₹ 1,750'],
            ['Complete Financial Health Analysis', 'End-to-end financial fitness audit', '₹ 5,999', '₹ 3,000']
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
        return { full: `₹ ${fmt(num)}`, half: `₹ ${fmt(Math.round(num / 2))}` }
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
                        We understand every individual's financial needs are unique. Some prefer focused consultations; others value year-round partnership and proactive review.
                    </p>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                        That's why we designed two flexible engagement models — so you choose what fits your lifestyle, goals, and comfort.
                    </p>
                </div>

                {/* Section 1: Pay As You Go vs Pro Plan */}
                <div className="mb-16">
                    <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 shadow-lg border border-emerald-100 mb-8 md:sticky md:top-20 md:z-30">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                            <div className="lg:flex-1">
                                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Pay As You Go vs. Pro Plan (50% Off)</h3>
                                <p className="text-slate-700">Choose between one-time services or save 50% with our Pro Plan subscription</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                                <div className="bg-white p-4 rounded-lg border border-emerald-200 flex-1 sm:flex-none">
                                    <h4 className="font-semibold text-emerald-700 mb-2">🔸 Pay As You Go</h4>
                                    <p className="text-sm text-slate-600">For those with one-time support needs</p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-300 flex-1 sm:flex-none">
                                    <h4 className="font-bold text-emerald-800 mb-2">⭐ Pro Plan (50% OFF)</h4>
                                    <p className="text-sm text-slate-700">For those with ongoing support</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Services Table - All categories collapsible */}
                    <div className="space-y-2">
                        {model1.map((category, catIndex) => (
                            <div key={catIndex} className="bg-white rounded-lg border border-emerald-100 overflow-hidden">
                                {/* Category Header - Always shows prices */}
                                <button
                                    onClick={() => toggleCategory(category.category)}
                                    className="w-full bg-emerald-50 p-2 border-b border-emerald-200 text-left hover:bg-emerald-100 transition-colors"
                                >
                                    <div className="grid grid-cols-12 items-center w-full gap-4">
                                        {/* Left: icon + title (matches service row col-span-6) */}
                                        <div className="col-span-6 flex flex-col sm:flex-row sm:items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${expandedCategories[category.category] ? 'bg-emerald-100 text-emerald-700 rotate-90' : 'bg-slate-100 text-slate-600'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-emerald-800">{category.category}</h3>
                                                {category.description && (
                                                    <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Desktop: align prices into the same 3+3 columns used by service rows */}
                                        <div className="hidden sm:flex col-span-3 items-center justify-center">
                                            <div className="bg-white p-2 rounded-lg border border-emerald-200 text-center w-full max-w-[140px]">
                                                <div className="text-lg font-bold text-emerald-800">{formatPrices(category.packagePrice).full}</div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex col-span-3 items-center justify-center">
                                            <div className="bg-emerald-50 p-2 rounded-lg border-2 border-emerald-300 text-center w-full max-w-[140px]">
                                                <div className="text-lg font-bold text-emerald-800">{formatPrices(category.packagePrice).half}</div>
                                            </div>
                                        </div>

                                        {/* Mobile: stacked full-width prices below the title */}
                                        <div className="sm:hidden col-span-12 mt-2 flex flex-col gap-2">
                                            <div className="bg-white p-2 rounded-lg border border-emerald-200 text-center">
                                                <div className="text-sm font-bold text-emerald-800">{formatPrices(category.packagePrice).full}</div>
                                            </div>
                                            <div className="bg-emerald-50 p-2 rounded-lg border-2 border-emerald-300 text-center">
                                                <div className="text-sm font-bold text-emerald-800">{formatPrices(category.packagePrice).half}</div>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Category Content - Shows when expanded */}
                                {expandedCategories[category.category] && (
                                    <div className="animate-slide-down">
                                       

                                        {/* Services List */}
                                        <div className="divide-y divide-slate-100">
                                            {category.items.map((service, serviceIndex) => {
                                                const serviceKey = `${category.category}-${serviceIndex}`
                                                const isExpanded = expandedServices[serviceKey] || false

                                                return (
                                                    <div key={serviceIndex} className="hover:bg-slate-50/50 transition-colors">
                                                        <div className="grid grid-cols-12 p-4 items-center">
                                                            <div className="col-span-6">
                                                                <div className="flex items-start gap-3">
                                                                    
                                                                            <div>
                                                                                <h4 className="font-medium text-slate-900">{service[0]}</h4>
                                                                                {service[1] && <p className="text-sm text-slate-500 mt-1">{service[1]}</p>}
                                                                            </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-3 text-center">
                                                                <div className="font-semibold text-slate-700">{service[2]}</div>
                                                            </div>
                                                            <div className="col-span-3 text-center">
                                                                <div className="font-bold text-emerald-700">{service[3]}</div>
                                                                <div className="text-xs text-slate-500 line-through">{service[2]}</div>
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

                    {/* CTA: Ad-hoc consultation prompt */}
                    <div className="mx-auto max-w-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-lg mt-8">
                        <div className="mx-auto">
                            <h4 className="text-2xl font-bold mb-3">Unsure what you need? Let’s talk.</h4>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="#ad-hoc-consultation"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
                                >
                                    Book an Ad-hoc Consultation
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Get More for Less - Bundles */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                      
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Get More for Less!</h3>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Get pocket-friendly deals designed exclusively for your business. Protect your business legally.
                        </p>
                       
                    </div>

                    {/* Bundle Comparison Table (Essential / Advanced / Premier) */}
                    <div className="overflow-x-auto mb-10">
                        <div className="min-w-[900px] bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                            <table className="w-full table-fixed text-sm">
                                <thead className="bg-emerald-50">
                                    <tr>
                                        <th className="w-1/3 text-left py-4 px-5"></th>
                                        <th className="text-center py-4 px-5">
                                            <div className="text-sm font-semibold">Essential</div>
                                            <div className="text-xs text-slate-600 mt-1">Starter</div>
                                        </th>
                                        <th className="text-center py-4 px-5">
                                            <div className="text-sm font-semibold">Advanced</div>
                                            <div className="text-xs text-slate-600 mt-1">Growth</div>
                                        </th>
                                        <th className="text-center py-4 px-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="text-sm font-semibold">Premier</div>
                                                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Popular</span>
                                            </div>
                                            <div className="text-xs text-slate-600 mt-1">Comprehensive</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/** rows with zebra and hover */}
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Items Included</td>
                                        <td className="py-3 px-5 text-center">any 2 components</td>
                                        <td className="py-3 px-5 text-center">any 4 components</td>
                                        <td className="py-3 px-5 text-center">all</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Association</td>
                                        <td className="py-3 px-5 text-center">3 mos</td>
                                        <td className="py-3 px-5 text-center">6 mos</td>
                                        <td className="py-3 px-5 text-center">One year</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Team</td>
                                        <td className="py-3 px-5 text-center">only CFP</td>
                                        <td className="py-3 px-5 text-center">CFP + any 1 serv. provider of your choice</td>
                                        <td className="py-3 px-5 text-center">CFP + CA + LA + RA + InsA + EA</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Personal Sessions (with Krutika)</td>
                                        <td className="py-3 px-5 text-center">-</td>
                                        <td className="py-3 px-5">1 session — 30 mins (phone)</td>
                                        <td className="py-3 px-5">3 sessions — 30 mins (Zoom)</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Educational Sessions</td>
                                        <td className="py-3 px-5 text-center">Monthly</td>
                                        <td className="py-3 px-5 text-center">Monthly</td>
                                        <td className="py-3 px-5 text-center">Monthly + 6 trainer sessions</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Review Sessions</td>
                                        <td className="py-3 px-5 text-center">1 after 4 mos</td>
                                        <td className="py-3 px-5 text-center">1 after 4 mos + monthly Zoom</td>
                                        <td className="py-3 px-5 text-center">1 Zoom each provider + CFP</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Mode of communication</td>
                                        <td className="py-3 px-5">1 Zoom; then phone/email</td>
                                        <td className="py-3 px-5">Monthly Zoom; then phone/email</td>
                                        <td className="py-3 px-5">Zoom with providers; then phone/email</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">TAT (Turn around time)</td>
                                        <td className="py-3 px-5 text-center">5–7 days</td>
                                        <td className="py-3 px-5 text-center">4–6 days</td>
                                        <td className="py-3 px-5 text-center">3–5 days</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Discount on further services</td>
                                        <td className="py-3 px-5 text-center">N/A</td>
                                        <td className="py-3 px-5 text-center">10%</td>
                                        <td className="py-3 px-5 text-center">15–20%</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Carry Forward</td>
                                        <td className="py-3 px-5 text-center">N/A</td>
                                        <td className="py-3 px-5 text-center">Yes</td>
                                        <td className="py-3 px-5 text-center">Yes</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Flexibility</td>
                                        <td className="py-3 px-5 text-center">Pause/Cancel anytime</td>
                                        <td className="py-3 px-5 text-center">Pause/Cancel anytime</td>
                                        <td className="py-3 px-5 text-center">Pause/Cancel anytime</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Not Included</td>
                                        <td className="py-3 px-5">Comprehensive Financial Planning</td>
                                        <td className="py-3 px-5">Comprehensive Financial Planning; reminders about important dates</td>
                                        <td className="py-3 px-5">None</td>
                                    </tr>
                                    <tr className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                                        <td className="py-3 px-5 font-semibold">Additional FREE benefits</td>
                                        <td className="py-3 px-5 text-center">-</td>
                                        <td className="py-3 px-5">Reminders about important dates and renewals</td>
                                        <td className="py-3 px-5">Reminders for insurance renewals, tax filing, goal achievements</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                 
                </div>

                {/* Section CTA */}
                <div className="mx-auto max-w-3xl bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-8 text-center text-white shadow-lg mt-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <h5 className="font-bold text-slate-900 text-2xl mb-4">Still unsure which option fits you best?</h5>
                        <p className="text-lg text-slate-600 mb-6">
                            Book a free 15-minute discovery call and we'll help you decide which approach works best for your needs.
                        </p>
                        <div className="space-y-4">
                            <a
                                href="#schedule"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-emerald-100 text-emerald-400 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors shadow-md"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Schedule a Call
                            </a>
                           
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