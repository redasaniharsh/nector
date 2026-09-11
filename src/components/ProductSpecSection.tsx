import React from 'react';
import { ASSETS } from '../assets/images';
import { PRODUCT_SPEC } from '../data/productData';
import { Sparkles, ShieldCheck, Droplets, CheckCircle2 } from 'lucide-react';

export const ProductSpecSection: React.FC = () => {
  return (
    <section id="specs" className="relative py-28 md:py-40 bg-[#0b0704] text-[#f4ede4] border-t border-[#1f1711] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-radial-hero pointer-events-none opacity-40 blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Headline + Subheading + Description + Feature Bullets) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Technical Subheading Line */}
            <div className="flex items-center space-x-3 text-xs md:text-sm font-tech text-[#ff8a1e] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#ff8a1e] inline-block"></span>
              <span>{PRODUCT_SPEC.subheading}</span>
            </div>

            {/* Heavy Display Headline */}
            <h2 className="font-display fluid-section-headline font-black tracking-tight text-[#f4ede4]">
              {PRODUCT_SPEC.headline}
            </h2>

            {/* Clean Body Copy (max-w ~65-70ch) */}
            <p className="font-body text-[#9c8f80] text-base md:text-lg leading-relaxed max-w-[65ch]">
              {PRODUCT_SPEC.description}
            </p>

            {/* Bullet Points with Clean Minimal Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {PRODUCT_SPEC.bulletPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-[#140e0a] border border-[#2a1e16] hover:border-[#ff8a1e]/40 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#ff8a1e] shrink-0 mt-0.5" />
                  <span className="font-body text-sm font-medium text-[#f4ede4]">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Technical Specs Row */}
            <div className="pt-6 border-t border-[#261b13] flex flex-wrap items-center gap-8 font-tech text-xs text-[#9c8f80]">
              <div>
                <span className="text-[#f4ede4] font-semibold block text-sm">5 CULTIVARS</span>
                <span>SINGLE-ORCHARD SOURCED</span>
              </div>
              <div className="w-[1px] h-8 bg-[#261b13]"></div>
              <div>
                <span className="text-[#f4ede4] font-semibold block text-sm">48-HR SLOW CURE</span>
                <span>LOW TEMPERATURE GENTLE DEHYDRATION</span>
              </div>
              <div className="w-[1px] h-8 bg-[#261b13]"></div>
              <div>
                <span className="text-[#f4ede4] font-semibold block text-sm">UV-400 GLASS</span>
                <span>PRESERVES VOLATILE TERPENES</span>
              </div>
            </div>

          </div>

          {/* Right Column (Rotated Product Shot + Floating Numeric Callout) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Radial Spotlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff8a1e]/15 to-teal-500/10 rounded-full blur-3xl" />

            {/* Rotated / Angled Product Image */}
            <div className="relative z-10 group transition-transform duration-700 hover:scale-105">
              <img
                src={ASSETS.jarSpec}
                alt="NÉCTAR 450G Apothecary Specimen"
                className="w-full max-w-[420px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] filter brightness-105"
                referrerPolicy="no-referrer"
              />

              {/* Floating Numeric Callout Badge ("450G") */}
              <div className="absolute -top-4 -right-4 sm:top-4 sm:right-0 bg-[#140e0a]/90 backdrop-blur-md border border-[#ff8a1e]/50 px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col items-center">
                <span className="font-tech text-[10px] text-[#ff8a1e] tracking-widest uppercase">
                  NET CONTENT
                </span>
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#f4ede4]">
                  450G
                </span>
                <span className="font-tech text-[9px] text-[#9c8f80] tracking-wider uppercase mt-1">
                  APPROX. 65 GEMS
                </span>
              </div>

              {/* Bottom Subtle Tag */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0b0704]/90 border border-[#2a1e16] px-4 py-1.5 rounded-full font-tech text-[10px] text-[#9c8f80] tracking-wider uppercase whitespace-nowrap">
                FLUTED CRYSTAL APOTHECARY JAR
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
