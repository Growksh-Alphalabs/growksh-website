import React from 'react'
import Layout from '../../components/common/Layout'
import Hero from '../../components/Wealthcraft/Hero'
import WhatWeDo from '../../components/Wealthcraft/WhatWeDo'
import Peace from '../../components/Wealthcraft/Peace'
import WhoWeServe from '../../components/Wealthcraft/WhoWeServe'
import WealthProcess from '../../components/Wealthcraft/WealthProcess'
import ServicesPricing from '../../components/Wealthcraft/ServicesPricing'
import Trust from '../../components/Wealthcraft/Trust'
import Testimonials from '../../components/Wealthcraft/Testimonials'
import CTAInline from '../../components/Wealthcraft/CTAInline'
import Compliance from '../../components/Wealthcraft/Compliance'

export default function Wealthcraft() {
  return (
      <div className="bg-white">
        <Hero />
        <WhatWeDo />
        <Peace />
        <WhoWeServe />
        <WealthProcess />
        <ServicesPricing />
        <Trust />
        <Testimonials />
        <CTAInline />
        <Compliance />
      </div>
  )
}
