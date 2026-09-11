import React from 'react';
import { INGREDIENTS_LIST } from '../data/productData';
import { ASSETS } from '../assets/images';
import { Leaf, Shield, Award, Sparkles } from 'lucide-react';

export const IngredientListSection: React.FC = () => {
  return (
    <section id="ingredients" className="relative py-28 md:py-36 bg-[#0b0704] text-[#f4ede4] border-t border-[#1f1711] overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-radial-pedestal pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Card-style ingredient rows with value pills */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="font-tech text-xs text-[#ff8a1e] tracking-widest uppercase mb-1 flex items-center space-x-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Bioactive Fruit Matrix // Lab Verified</span>
            </div>

            <div className="space-y-3.5">
              {INGREDIENTS_LIST.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex items-center justify-between p-5 md:p-6 rounded-2xl bg-[#140e0a] border border-[#261c14] hover:border-[#ff8a1e]/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,138,30,0.1)]"
                >
                  <div className="flex flex-col space-y-1 pr-4">
                    <span className="font-display text-lg md:text-xl font-bold text-[#f4ede4] group-hover:text-[#ff8a1e] transition-colors">
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
              ))}
            </div>

            <div className="pt-2 flex items-center space-x-2 font-tech text-[11px] text-[#9c8f80]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Third-party tested for 100% purity, heavy metal zero-tolerance standard.</span>
            </div>
          </div>

          {/* Right Column: Benefit Headline + Rotated Jar Visual */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6">
            
            <div className="space-y-4">
              <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.2em] uppercase">
                Confectionery Elevated To High Art
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#f4ede4] leading-[1.08]">
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
