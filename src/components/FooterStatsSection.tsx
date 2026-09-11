import React from 'react';
import { FOOTER_STATS, BRAND_NAME, BRAND_TAGLINE } from '../data/productData';
import { ASSETS } from '../assets/images';

export const FooterStatsSection: React.FC = () => {
  return (
    <footer className="relative bg-[#080503] text-[#f4ede4] border-t border-[#1f1711] overflow-hidden pt-24 pb-16">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial-pedestal opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Summary & Visual */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.25em] uppercase">
            Pure Botanical Formulation
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#f4ede4]">
            Refreshing Purity
          </h2>
          <p className="font-body text-[#9c8f80] text-sm md:text-base leading-relaxed">
            {BRAND_NAME} is about getting more from natural fruit. Slow cold-reduced, non-GMO, vegan citrus pectin, and uncompromised artisanal craftsmanship.
          </p>

          {/* Centered Small Jar Visual matching 2cal footer layout */}
          <div className="pt-6 flex justify-center">
            <img
              src={ASSETS.heroJar}
              alt="NÉCTAR Confection Jar"
              className="w-48 h-48 object-contain drop-shadow-[0_15px_30px_rgba(255,138,30,0.15)] filter brightness-95"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* 4 Large Numeric Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-[#1e150f] text-center">
          {FOOTER_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center space-y-1 group">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#ff8a1e] group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </span>
              <span className="font-tech text-xs sm:text-sm font-semibold tracking-widest text-[#f4ede4] uppercase">
                {stat.label}
              </span>
              <span className="font-body text-[11px] text-[#9c8f80] max-w-[180px] leading-snug">
                {stat.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Legal Links Row */}
        <div className="pt-12 pb-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-tech text-xs tracking-wider uppercase text-[#9c8f80]">
          <a href="#terms" className="hover:text-[#ff8a1e] transition-colors">
            Terms & Conditions
          </a>
          <span className="text-[#2a1e16] hidden sm:inline">•</span>
          <a href="#refund" className="hover:text-[#ff8a1e] transition-colors">
            Refund & Cancellation
          </a>
          <span className="text-[#2a1e16] hidden sm:inline">•</span>
          <a href="#shipping" className="hover:text-[#ff8a1e] transition-colors">
            Shipping & Delivery
          </a>
          <span className="text-[#2a1e16] hidden sm:inline">•</span>
          <a href="#contact" className="hover:text-[#ff8a1e] transition-colors">
            Contact Us
          </a>
        </div>

        {/* Bottom Copyright and Verification Mark */}
        <div className="pt-6 border-t border-[#1a120c] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9c8f80] font-tech space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} {BRAND_NAME} Confectionery Co. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-[#9c8f80]/80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>AGENCY-GRADE SCROLL ARCHITECTURE // A-GRADE BUILD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
