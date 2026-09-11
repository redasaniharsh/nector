import React, { useState, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { BRAND_NAME } from '../data/productData';

export const MarqueeTextSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute slight rotation for center product based on scroll
  const rotationAngle = (scrollY * 0.08) % 360;

  return (
    <section className="relative py-28 md:py-36 bg-[#0b0704] text-[#f4ede4] overflow-hidden border-t border-[#1f1711]">
      
      {/* Background Tiled Marquee Layers (Full-Bleed Environmental Typography Texture) */}
      <div className="absolute inset-0 flex flex-col justify-center space-y-6 md:space-y-8 select-none pointer-events-none opacity-20 overflow-hidden">
        
        {/* Row 1: Leftward Marquee */}
        <div className="animate-marquee-left whitespace-nowrap flex space-x-12">
          {Array.from({ length: 8 }).map((_, idx) => (
            <span
              key={`row1-${idx}`}
              className="font-display text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-transparent stroke-text"
              style={{
                WebkitTextStroke: '1.5px #9c8f80',
                color: 'transparent'
              }}
            >
              {BRAND_NAME} • FRUIT BURST • PURE NECTAR •
            </span>
          ))}
        </div>

        {/* Row 2: Rightward Marquee (Filled High Energy) */}
        <div className="animate-marquee-right whitespace-nowrap flex space-x-12">
          {Array.from({ length: 8 }).map((_, idx) => (
            <span
              key={`row2-${idx}`}
              className="font-display text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-[#3a2c20]/60"
            >
              SUNLIT ORCHARDS • 100% BOTANICAL • ZERO SUGAR •
            </span>
          ))}
        </div>

        {/* Row 3: Leftward Marquee (Outlined) */}
        <div className="animate-marquee-left whitespace-nowrap flex space-x-12">
          {Array.from({ length: 8 }).map((_, idx) => (
            <span
              key={`row3-${idx}`}
              className="font-display text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-transparent"
              style={{
                WebkitTextStroke: '1.5px #ff8a1e',
                opacity: 0.35
              }}
            >
              ALPHONSO MANGO • WHITE PEACH • WILD BERRY •
            </span>
          ))}
        </div>

      </div>

      {/* Foreground Container: Product floating on top of typography texture */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* Section Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#140e0a]/90 border border-[#ff8a1e]/40 text-[#ff8a1e] font-tech text-xs tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(255,138,30,0.2)]">
          <span>Environmental Texture Layer // Dynamic Flow</span>
        </div>

        {/* Center Rotating Product Shot */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Radial amber & cyan back-glow */}
          <div className="absolute w-[450px] h-[450px] bg-radial-hero opacity-70 blur-3xl pointer-events-none" />
          
          <div
            className="relative transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${rotationAngle * 0.15 - 8}deg) scale(1.04)`
            }}
          >
            <img
              src={ASSETS.heroJar}
              alt="NÉCTAR Rotating 3D Specimen"
              className="w-full max-w-[420px] md:max-w-[480px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Caption below */}
        <div className="mt-8 max-w-md space-y-2">
          <h3 className="font-display text-2xl md:text-3xl font-black text-[#f4ede4] tracking-tight">
            Sensory Botanical Harmony
          </h3>
          <p className="font-body text-sm text-[#9c8f80] leading-relaxed">
            Every jar captures the intense aromatics of orchard harvests, preserved in our signature fluted glass geometry.
          </p>
        </div>

      </div>

    </section>
  );
};
