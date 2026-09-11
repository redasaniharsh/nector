import React from 'react';
import { INGREDIENTS_LIST } from '../data/productData';
import { ASSETS } from '../assets/images';
import { Leaf, Shield, Award, Sparkles } from 'lucide-react';
import { useInView } from '../lib/useInView';

const VARIETY_THEMES: Record<string, { glow: string; border: string; origin: string }> = {
  'ing-1': {
    glow: 'rgba(255, 145, 30, 0.36)',
    border: 'rgba(255, 145, 30, 0.65)',
    origin: 'Sourced from Ratnagiri & Alpine Orchard Foothills',
  },
  'ing-2': {
    glow: 'rgba(224, 185, 155, 0.32)',
    border: 'rgba(224, 185, 155, 0.60)',
    origin: 'Slow Cold-Reduced Nectar Matrix • 0g Refined Cane Sugar',
  },
  'ing-3': {
    glow: 'rgba(127, 168, 96, 0.35)',
    border: 'rgba(127, 168, 96, 0.60)',
    origin: 'Single-Estate Sicilian Lemon Peels • Low Heat Extraction',
  },
  'ing-4': {
    glow: 'rgba(148, 62, 108, 0.38)',
    border: 'rgba(148, 62, 108, 0.65)',
    origin: 'Wild-Foraged Acerola Superfruit • Vitamin C Synergy',
  },
  'ing-5': {
    glow: 'rgba(212, 163, 75, 0.32)',
    border: 'rgba(212, 163, 75, 0.60)',
    origin: 'Certified Organic Palm Frond Dew • Zero Petroleum Wax',
  },
};

const DEFAULT_GLOW = 'rgba(255, 138, 30, 0.22)';

export const IngredientListSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [activeGlow, setActiveGlow] = React.useState(DEFAULT_GLOW);

  return (
    <section id="ingredients" className="relative py-28 md:py-36 bg-[#0b0704] text-[#f4ede4] border-t border-[#1f1711] overflow-hidden">
      {/* Dynamic ambient background glow that shifts tone per variety */}
      <div
        className="absolute bottom-0 right-0 w-[650px] h-[650px] rounded-full pointer-events-none transition-all duration-700 blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle at 60% 60%, ${activeGlow} 0%, rgba(11, 7, 4, 0) 70%)`
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Card-style ingredient rows with value pills */}
          <div className={`lg:col-span-6 flex flex-col space-y-4 reveal-fade-up ${isInView ? 'is-revealed' : ''}`}>
            <div className="font-tech text-xs text-[#ff8a1e] tracking-widest uppercase mb-1 flex items-center space-x-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Bioactive Fruit Matrix // Lab Verified</span>
            </div>

            <div className="space-y-3.5">
              {INGREDIENTS_LIST.map((item) => {
                const theme = VARIETY_THEMES[item.id] || {
                  glow: DEFAULT_GLOW,
                  border: 'rgba(255, 138, 30, 0.6)',
                  origin: 'Artisanal Single-Origin Harvest'
                };

                return (
                  <div
                    key={item.id}
                    data-cursor="view"
                    onMouseEnter={() => setActiveGlow(theme.glow)}
                    onMouseLeave={() => setActiveGlow(DEFAULT_GLOW)}
                    className="group relative flex flex-col p-5 md:p-6 rounded-2xl bg-[#140e0a] border border-[#261c14] transition-all duration-300 transform hover:scale-[1.025] hover:contrast-[1.04] hover:saturate-[1.08] cursor-pointer"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1 pr-4">
                        <span className="font-display text-lg md:text-xl font-bold text-[#f4ede4] group-hover:text-[#ffaa33] transition-colors">
                          {item.name}
                        </span>
                        <span className="font-body text-xs md:text-sm text-[#9c8f80] leading-snug">
                          {item.detail}
                        </span>
                      </div>

                      {/* Value Pill on the right */}
                      <div className="shrink-0 px-4 py-2 rounded-full bg-[#1e150f] border border-[#3d2b1e] text-[#ff8a1e] group-hover:bg-[#ff8a1e] group-hover:text-[#0b0704] font-tech text-xs md:text-sm font-bold tracking-wider transition-all duration-300 shadow-inner">
                        {item.value}
                      </div>
                    </div>

                    {/* Sliding Origin Provenance Caption */}
                    <div className="overflow-hidden max-h-0 group-hover:max-h-8 transition-all duration-300 ease-out">
                      <div className="pt-2.5 mt-2 border-t border-[#261c14] flex items-center space-x-1.5 font-tech text-[10px] tracking-wider text-[#ffaa33] uppercase">
                        <span className="w-1 h-1 rounded-full bg-[#ffaa33] inline-block" />
                        <span>{theme.origin}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center space-x-2 font-tech text-[11px] text-[#9c8f80]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Third-party tested for 100% purity, heavy metal zero-tolerance standard.</span>
            </div>
          </div>

          {/* Right Column: Benefit Headline + Rotated Jar Visual */}
          <div className={`lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6 reveal-fade-up delay-200 ${isInView ? 'is-revealed' : ''}`}>
            
            <div className="space-y-4">
              <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.2em] uppercase">
                Confectionery Elevated To High Art
              </span>
              <h2 className="font-display fluid-section-headline font-black tracking-tight text-[#f4ede4]">
                Earth's Purest Fruit Confection
              </h2>
              <p className="font-body text-[#9c8f80] text-base md:text-lg leading-relaxed max-w-lg">
                Made with sun-ripened orchard botanicals known to nourish mood, satisfy refined palates, and provide clean sensorial joy without refined sugar spikes or synthetic waxes.
              </p>
            </div>

            {/* Rotated Product Shot with Caustic Glass Reflection */}
            <div className="relative flex items-center justify-center pt-4">
              <div className="absolute inset-0 max-w-sm mx-auto bg-radial-pedestal opacity-50 blur-xl" />
              <img
                src={ASSETS.jarAngle}
                alt="NÉCTAR 3/4 Perspective"
                className="relative z-10 w-full max-w-[360px] aspect-[4/5] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transform -rotate-1 hover:rotate-0 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-2 bg-[#0b0704]/90 backdrop-blur-md border border-[#ff8a1e]/40 px-4 py-1.5 rounded-full font-tech text-[10px] text-[#ff8a1e] tracking-widest uppercase">
                MANGO // WHITE PEACH // WILD BERRY
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
