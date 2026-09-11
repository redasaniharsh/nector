import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroScrollStage } from './components/HeroScrollStage';
import { ProductSpecSection } from './components/ProductSpecSection';
import { IngredientListSection } from './components/IngredientListSection';
import { MarqueeTextSection } from './components/MarqueeTextSection';
import { CircularRingSection } from './components/CircularRingSection';
import { FooterStatsSection } from './components/FooterStatsSection';
import { CartDrawer } from './components/CartDrawer';
import { ExportFramesModal } from './components/ExportFramesModal';
import { CinematicPreloader } from './components/CinematicPreloader';
import { ShoppingBag } from 'lucide-react';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0704] text-[#f4ede4] relative selection:bg-[#ff8a1e] selection:text-[#0b0704]">
      
      {/* 0. Cinematic Luxury Preloader ("From the Orchard") */}
      <CinematicPreloader onComplete={() => setIsPreloaded(true)} />

      {/* 1. Fixed Sticky Top Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenExporter={() => setIsExporterOpen(true)}
      />

      {/* 2. Pinned Hero Scroll-Animation (The Centerpiece) */}
      <main>
        <HeroScrollStage onOpenCart={() => setIsCartOpen(true)} isReady={isPreloaded} />

        {/* 3. Product Spec Section */}
        <ProductSpecSection />

        {/* 4. Ingredient / Feature List Section */}
        <IngredientListSection />

        {/* 5. Tiled Marquee Background Text Section */}
        <MarqueeTextSection />

        {/* 6. Circular Feature-Ring Section (Trigonometric badge placement) */}
        <CircularRingSection />

        {/* 7. Footer Stats & Links */}
        <FooterStatsSection />
      </main>

      {/* Persistent Floating "BUY NOW" Pill (Matching Reference Video Bottom-Right Layout) */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
        <button
          type="button"
          id="btn-floating-buy-now"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart and buy now"
          className="group flex items-center space-x-2.5 px-5 py-3 rounded-full bg-[#140e0a]/90 hover:bg-[#1f150f] border border-[#ff8a1e] text-[#f4ede4] font-display font-bold text-xs md:text-sm tracking-wider uppercase backdrop-blur-md shadow-[0_0_30px_rgba(255,138,30,0.35)] hover:shadow-[0_0_40px_rgba(255,138,30,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
        >
          <div className="w-6 h-6 rounded-full bg-[#ff8a1e] text-[#0b0704] flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#f4ede4] group-hover:text-[#ff8a1e] transition-colors">
            BUY NOW
          </span>
        </button>
      </div>

      {/* Slide-over Luxury Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* 3D Frame Sequence Inspector & Exporter Modal */}
      <ExportFramesModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
      />

    </div>
  );
}
