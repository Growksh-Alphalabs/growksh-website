import React from 'react'
import ServicesPricingSection1 from './ServicesPricingSection1'
import ServicesPricingSection2 from './ServicesPricingSection2'

export default function ServicesPricing() {
  return (
    <section id="wealthcraft-pricing" className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <ServicesPricingSection1 />
        <ServicesPricingSection2 />
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
