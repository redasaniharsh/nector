import React from 'react';
import { Sun, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useInView } from '../lib/useInView';

export const FarmToJarStrip: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const steps = [
    {
      step: '01',
      title: 'Orchard Canopy',
      subtitle: 'Sunlit Blossom Sourcing',
      detail: 'Hand-picked from certified single-origin orchards at peak ripening.',
      icon: Sun,
    },
    {
      step: '02',
      title: 'Sun-Dried Curing',
      subtitle: 'Solar Thermal Reduction',
      detail: 'Slow dehydration under filtered sun preserves delicate terpene aromatics.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Hand-Sorted',
      subtitle: 'Artisanal Grading',
      detail: 'Triple-inspected for size, moisture uniformity, and gem integrity.',
      icon: CheckCircle2,
    },
    {
      step: '04',
      title: 'Cold-Sealed Jar',
      subtitle: 'Apothecary Preservation',
      detail: 'Sealed inside heavy fluted crystal glass with UV-protective finish.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Farm to Jar Journey"
      className="relative py-20 md:py-28 bg-[#090604] border-y border-[#1f1711] overflow-hidden text-[#f4ede4]"
    >
      {/* Subtle Warm Amber Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-radial-hero opacity-25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Strip Header */}
        <div className={`text-center max-w-xl mx-auto mb-16 space-y-2.5 reveal-fade-up ${isInView ? 'is-revealed' : ''}`}>
          <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.25em] uppercase">
            ORIGIN TO CONFECTION // 4-STAGE PROVENANCE
          </span>
          <h2 className="font-display fluid-section-headline font-black tracking-tight text-[#f4ede4]">
            From Orchard To Apothecary Jar
          </h2>
        </div>

        {/* 4 Steps Horizontal Flow with Connecting SVG Line */}
        <div className="relative">
          
          {/* Connecting SVG Path with self-drawing stroke-dashoffset */}
          <div className="hidden lg:block absolute top-[46px] left-[10%] right-[10%] h-1 pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 4">
              <line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                stroke="#ffaa33"
                strokeWidth="2"
                strokeDasharray="6 8"
                style={{
                  strokeDashoffset: isInView ? 0 : 1000,
                  transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{ animationDelay: `${idx * 160}ms` }}
                  className={`flex flex-col items-center text-center p-6 rounded-2xl bg-[#120c08]/80 border border-[#261c14] hover:border-[#ffaa33]/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,170,51,0.1)] group reveal-fade-up ${
                    isInView ? 'is-revealed' : ''
                  }`}
                >
                  {/* Step Icon Badge */}
                  <div className="w-16 h-16 rounded-full bg-[#1c130c] border border-[#38281c] group-hover:border-[#ffaa33] flex items-center justify-center mb-5 text-[#ff8a1e] group-hover:scale-110 group-hover:text-[#ffaa33] transition-all duration-300 shadow-[0_0_20px_rgba(255,138,30,0.15)] relative">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-1.5 -right-1.5 font-tech text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff8a1e] text-[#0b0704]">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#f4ede4] group-hover:text-[#ffaa33] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <span className="font-tech text-xs text-[#ffaa33]/85 uppercase tracking-wider mb-2">
                    {item.subtitle}
                  </span>
                  <p className="font-body text-xs text-[#9c8f80] leading-relaxed max-w-[220px]">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FarmToJarStrip;
