import React from 'react'
import Hero from '../components/Hero/Hero'
import Philosophy from '../components/Philosophy/Philosophy'
import Pillars from '../components/Pillars/Pillars'
import Story from '../components/Story/Story'
import Stats from '../components/Stats/Stats'
import Testimonials from '../components/Testimonials/Testimonials'
import InsightsPreview from '../components/InsightsPreview/InsightsPreview'
import CTASection from '../components/CTA/CTASection'
import ContactSection from '../components/Contact/ContactSection'

export default function Home() {
  return (
    <div>
      <Hero />
      <Philosophy />
      <Pillars />
      <Story />
      <Stats />
      <Testimonials />
      <InsightsPreview />
      <CTASection />
      <ContactSection />
    </div>
  )
}
