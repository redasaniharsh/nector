import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Sliders } from 'lucide-react';
import { BRAND_NAME, BRAND_VERSION } from '../data/productData';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenExporter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenExporter }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0b0704]/90 backdrop-blur-md border-b border-[#261c14] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand Logo & Technical ID */}
        <div className="flex items-center space-x-6">
          <a
            href="#hero"
            id="brand-logo-link"
            className="group flex items-baseline space-x-1.5 focus:outline-none focus:ring-2 focus:ring-[#ff8a1e] rounded-sm"
          >
            <span className="font-display text-2xl md:text-3xl font-black tracking-tight text-[#f4ede4] group-hover:text-[#ff8a1e] transition-colors">
              {BRAND_NAME}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a1e]"></span>
          </a>

          <div className="hidden lg:flex items-center space-x-2 border-l border-[#2e2319] pl-6 text-[10px] font-tech text-[#9c8f80] tracking-widest uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse"></span>
            <span>{BRAND_VERSION}</span>
          </div>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-[#9c8f80]">
          <a
            href="#hero"
            id="nav-link-hero"
            className="hover:text-[#f4ede4] transition-colors focus:outline-none focus:text-[#ff8a1e]"
          >
            Explore
          </a>
          <a
            href="#specs"
            id="nav-link-specs"
            className="hover:text-[#f4ede4] transition-colors focus:outline-none focus:text-[#ff8a1e]"
          >
            Specification
          </a>
          <a
            href="#ingredients"
            id="nav-link-ingredients"
            className="hover:text-[#f4ede4] transition-colors focus:outline-none focus:text-[#ff8a1e]"
          >
            Ingredients
          </a>
          <a
            href="#circular-features"
            id="nav-link-craft"
            className="hover:text-[#f4ede4] transition-colors focus:outline-none focus:text-[#ff8a1e]"
          >
            Artisanship
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Frame Sequence Exporter / Debug Inspector */}
          <button
            id="btn-frame-exporter"
            onClick={onOpenExporter}
            title="Inspect & Export 120 3D WEBP Frames"
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#382b20] text-xs font-tech text-[#9c8f80] hover:text-[#f4ede4] hover:border-[#ff8a1e] transition-all bg-[#140e0a]/60 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ff8a1e]" />
            <span>Frames (120)</span>
          </button>

          {/* Shop CTA button */}
          <button
            id="btn-nav-shop-now"
            onClick={onOpenCart}
            className="relative group inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#ff8a1e] hover:bg-[#ff9c3a] text-[#0b0704] font-semibold text-xs tracking-wider uppercase transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(255,138,30,0.3)] hover:shadow-[0_0_30px_rgba(255,138,30,0.5)] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
