import React, { useState, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { CIRCULAR_BADGES } from '../data/productData';
import { useInView } from '../lib/useInView';

export const CircularRingSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  // Trigonometric coordinates calculation
  // x = cx + r * cos(theta_rad)
  // y = cy + r * sin(theta_rad)
  const [radius, setRadius] = useState(250);

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(160);
      } else if (window.innerWidth < 1024) {
        setRadius(210);
      } else {
        setRadius(260);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <section
      id="circular-features"
      className="relative py-32 md:py-44 bg-[#0b0704] text-[#f4ede4] overflow-hidden border-t border-[#1f1711]"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-hero opacity-35 blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* Section Header */}
        <div className={`mb-14 space-y-3 reveal-fade-up ${isInView ? 'is-revealed' : ''}`}>
          <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.25em] uppercase block">
            Botanical Architecture // 360° Formulation
          </span>
          <h2 className="font-display fluid-section-headline font-black tracking-tight text-[#f4ede4]">
            Pure Fruit Synergy
          </h2>
          <p className="font-body text-[#9c8f80] text-sm md:text-base max-w-lg mx-auto">
            Each formula pillar is calibrated for peak sensory delight, crisp texture, and zero synthetic residue.
          </p>
        </div>

        {/* Circular Ring Stage */}
        <div className={`relative w-full max-w-[680px] aspect-square mx-auto flex items-center justify-center reveal-fade-up delay-150 ${isInView ? 'is-revealed' : ''}`}>
          
          {/* Subtle Rotating SVG Ring with Amber Gradient & Caustic Notch */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_60s_linear_infinite]"
            viewBox="0 0 600 600"
          >
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8a1e" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff8a1e" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <circle
              cx="300"
              cy="300"
              r={radius * (600 / (radius * 2.3))}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1.75"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Static Inner Accent Ring */}
          <div
            className="absolute rounded-full border border-[#ff8a1e]/25 pointer-events-none transition-all duration-300"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`
            }}
          />

          {/* Centered Product Visual */}
          <div className="relative z-10 w-[240px] sm:w-[300px] md:w-[340px] aspect-[4/5] flex items-center justify-center">
            <div className="absolute inset-0 bg-radial-pedestal opacity-50 blur-2xl pointer-events-none" />
            <img
              src={ASSETS.jarAngle}
              alt="NÉCTAR Centerpiece"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Trigonometric Feature Badges (x = cx + r*cos(θ), y = cy + r*sin(θ)) */}
          {CIRCULAR_BADGES.map((badge) => {
            const rad = (badge.angleDeg * Math.PI) / 180;
            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(radius * Math.sin(rad));

            return (
              <div
                key={badge.id}
                className="absolute z-20 transition-transform duration-300 hover:scale-110"
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                }}
              >
                <div className="group flex flex-col items-center bg-[#140e0a]/95 backdrop-blur-md border border-[#ff8a1e]/60 hover:border-[#ff8a1e] px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all cursor-default whitespace-nowrap">
                  <span className="font-tech text-xs sm:text-sm font-bold text-[#f4ede4] tracking-wider uppercase group-hover:text-[#ff8a1e] transition-colors">
                    {badge.label}
                  </span>
                  {badge.accentText && (
                    <span className="font-tech text-[9px] text-[#ff8a1e]/80 tracking-widest uppercase">
                      {badge.accentText}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
