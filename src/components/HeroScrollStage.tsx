import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const Hero3DCanvas = lazy(() => import('./Hero3DCanvas'));

interface HeroScrollStageProps {
  onOpenCart?: () => void;
  isReady?: boolean;
}

/**
 * Calculates scroll-linked opacity and translateY for crossfading intro texts
 */
function getScrollWindow(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
): { opacity: number; translateY: number } {
  if (p < inStart) return { opacity: 0, translateY: 16 };
  if (p < inEnd) {
    const t = (p - inStart) / (inEnd - inStart);
    return { opacity: t, translateY: (1 - t) * 16 };
  }
  if (p <= outStart) {
    return { opacity: 1, translateY: 0 };
  }
  if (p < outEnd) {
    const t = (p - outStart) / (outEnd - outStart);
    return { opacity: 1 - t, translateY: -t * 16 };
  }
  return { opacity: 0, translateY: -16 };
}

export const HeroScrollStage: React.FC<HeroScrollStageProps> = ({ onOpenCart, isReady = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Check user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Scroll listener for sticky scroll choreography
  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1.0);
      return;
    }

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

        if (totalScrollable <= 0) return;

        const currentScroll = -rect.top;
        const rawProgress = currentScroll / totalScrollable;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        setProgress(clampedProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  // =========================================================================
  // SCROLL-LINKED INTRODUCTORY TEXT TRANSITIONS (0% - 43%)
  // Product Reveal phase: strictly scroll progress tied, reversible, no timers
  // =========================================================================
  const intro1 = prefersReducedMotion
    ? { opacity: 0, translateY: 0 }
    : progress <= 0.08
    ? { opacity: 1, translateY: -progress * 24 }
    : progress < 0.12
    ? { opacity: 1 - (progress - 0.08) / 0.04, translateY: -(progress - 0.08) * 40 - 2 }
    : { opacity: 0, translateY: -20 };

  const intro2a = prefersReducedMotion
    ? { opacity: 0, translateY: 0 }
    : getScrollWindow(progress, 0.10, 0.13, 0.15, 0.18);

  const intro2b = prefersReducedMotion
    ? { opacity: 0, translateY: 0 }
    : getScrollWindow(progress, 0.17, 0.20, 0.22, 0.25);

  const intro3a = prefersReducedMotion
    ? { opacity: 0, translateY: 0 }
    : getScrollWindow(progress, 0.25, 0.28, 0.30, 0.33);

  const intro3b = prefersReducedMotion
    ? { opacity: 0, translateY: 0 }
    : getScrollWindow(progress, 0.32, 0.36, 0.39, 0.43);

  // =========================================================================
  // SCROLL-LINKED MAIN HERO COMPOSITION REVEAL (43% - 55%)
  // Staggered cinematic reveal reaching full establishment by 55%
  // =========================================================================
  const headlineOpacity = prefersReducedMotion
    ? 1
    : progress < 0.43
    ? 0
    : Math.min(1, (progress - 0.43) / 0.06);
  const headlineY = prefersReducedMotion ? 0 : (1 - headlineOpacity) * 22;

  const sublineOpacity = prefersReducedMotion
    ? 1
    : progress < 0.46
    ? 0
    : Math.min(1, (progress - 0.46) / 0.05);
  const sublineY = prefersReducedMotion ? 0 : (1 - sublineOpacity) * 14;

  const descOpacity = prefersReducedMotion
    ? 1
    : progress < 0.48
    ? 0
    : Math.min(1, (progress - 0.48) / 0.05);
  const descY = prefersReducedMotion ? 0 : (1 - descOpacity) * 14;

  const ctaOpacity = prefersReducedMotion
    ? 1
    : progress < 0.52
    ? 0
    : Math.min(1, (progress - 0.52) / 0.04);
  const ctaY = prefersReducedMotion ? 0 : (1 - ctaOpacity) * 12;

  const spec450Opacity = prefersReducedMotion
    ? 1
    : progress < 0.50
    ? 0
    : Math.min(1, (progress - 0.50) / 0.04);
  const spec450Y = prefersReducedMotion ? 0 : (1 - spec450Opacity) * 20;

  const specDetailsOpacity = prefersReducedMotion
    ? 1
    : progress < 0.52
    ? 0
    : Math.min(1, (progress - 0.52) / 0.04);
  const specDetailsY = prefersReducedMotion ? 0 : (1 - specDetailsOpacity) * 14;

  const buyNowOpacity = prefersReducedMotion
    ? 1
    : progress < 0.52
    ? 0
    : Math.min(1, (progress - 0.52) / 0.04);
  const buyNowY = prefersReducedMotion ? 0 : (1 - buyNowOpacity) * 12;

  // Background warm amber glow smoothly intensifies as jar docks and settles
  const glowAlpha = 0.10 + Math.min(0.12, progress * 0.16);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[450vh] bg-gradient-to-b from-[#030201] via-[#1a100a] to-[#030201]"
    >
      {/* Pinned Sticky Viewport (100vh) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#030201] via-[#160e08] to-[#030201]">
        
        {/* Subtle, Warm Center Studio Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 will-change-transform"
          style={{
            background: `radial-gradient(circle at 50% 48%, rgba(255, 120, 25, ${glowAlpha}) 0%, rgba(35, 20, 12, 0.40) 40%, rgba(3, 2, 1, 0) 70%)`,
            transform: prefersReducedMotion ? 'none' : `translateY(${progress * 60}px)`,
          }}
        />

        {/* Centerpiece REAL-TIME 3D WebGL Jar with Packed Fruit Gummies */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isReady ? 'scale-100 opacity-100 drop-shadow-[0_20px_45px_rgba(255,138,30,0.22)]' : 'scale-90 opacity-0'
          }`}
        >
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="w-14 h-14 rounded-full border-2 border-[#ff8a1e]/20 border-t-[#ff8a1e] animate-spin" />
                <span className="font-tech text-xs tracking-[0.25em] text-[#ff8a1e]/80 uppercase">
                  CRAFTING CONFECTION...
                </span>
              </div>
            }
          >
            <Hero3DCanvas
              progress={progress}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>
        </div>

        {/* =========================================================================
            CINEMATIC INTRODUCTORY STATEMENTS (0% - 43%)
            Positioned away from product, quiet luxury typography, scroll-crossfading
           ========================================================================= */}
        <div className="absolute top-[22%] left-0 right-0 px-6 md:top-1/2 md:-translate-y-1/2 md:left-14 md:right-auto md:px-0 lg:left-20 z-20 pointer-events-none md:max-w-md text-center md:text-left">
          
          {/* 0% - 10%: Initial floating product intro */}
          {intro1.opacity > 0.005 && (
            <div
              style={{
                opacity: intro1.opacity,
                transform: `translateY(${intro1.translateY}px)`
              }}
              className="will-change-transform"
            >
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.35em] text-[#f4ede4] uppercase block">
                NÉCTAR
              </span>
              <span className="font-tech text-xs sm:text-sm tracking-[0.35em] text-[#ff8a1e] uppercase mt-2 block">
                LUXURY FRUIT CONFECTION
              </span>
              <span className="font-tech text-[10px] sm:text-xs tracking-[0.2em] text-[#a69888] uppercase mt-2 block md:hidden">
                EACH JAR IS 120G OF PURE BLISS
              </span>
            </div>
          )}

          {/* 10% - 18%: "VIVID FRUIT GEMS." */}
          {intro2a.opacity > 0.005 && (
            <div
              style={{
                opacity: intro2a.opacity,
                transform: `translateY(${intro2a.translateY}px)`
              }}
              className="will-change-transform"
            >
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#f4ede4] uppercase leading-tight">
                VIVID FRUIT GEMS.
              </h2>
            </div>
          )}

          {/* 17% - 25%: "CRAFTED FOR THE SENSES." */}
          {intro2b.opacity > 0.005 && (
            <div
              style={{
                opacity: intro2b.opacity,
                transform: `translateY(${intro2b.translateY}px)`
              }}
              className="will-change-transform"
            >
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#ff8a1e] uppercase leading-tight">
                CRAFTED FOR THE SENSES.
              </h2>
            </div>
          )}

          {/* 25% - 33%: "PURE FRUIT FLAVOR." */}
          {intro3a.opacity > 0.005 && (
            <div
              style={{
                opacity: intro3a.opacity,
                transform: `translateY(${intro3a.translateY}px)`
              }}
              className="will-change-transform"
            >
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#f4ede4] uppercase leading-tight">
                PURE FRUIT FLAVOR.
              </h2>
            </div>
          )}

          {/* 32% - 43%: "MANGO • PEACH • BERRY • CITRUS • APPLE" */}
          {intro3b.opacity > 0.005 && (
            <div
              style={{
                opacity: intro3b.opacity,
                transform: `translateY(${intro3b.translateY}px)`
              }}
              className="will-change-transform"
            >
              <h2 className="font-tech text-sm sm:text-base md:text-lg tracking-[0.25em] text-[#ff8a1e] uppercase font-semibold leading-relaxed">
                MANGO • PEACH • BERRY • CITRUS • APPLE
              </h2>
            </div>
          )}

        </div>

        {/* =========================================================================
            MAIN HERO REVEAL — MOBILE TOP: Subline + Headline above the jar
            MOBILE ONLY (md:hidden). Desktop uses the block below.
           ========================================================================= */}
        <div
          className="md:hidden absolute bottom-[67%] left-0 right-0 px-6 z-20 text-center pointer-events-none"
        >
          {/* Subline */}
          <div
            style={{ opacity: sublineOpacity, transform: `translateY(${sublineY}px)` }}
            className="font-tech text-xs text-[#ff8a1e] tracking-[0.25em] uppercase mb-3 flex items-center justify-center space-x-2 will-change-transform"
          >
            <span>NATURAL FRUIT PULP</span>
            <span>|</span>
            <span>ZERO ADDED SUGAR</span>
          </div>
          {/* Headline */}
          <h1
            style={{ opacity: headlineOpacity, transform: `translateY(${headlineY}px)` }}
            className="font-display text-3xl font-black tracking-tight text-[#f4ede4] leading-[1.06] mb-0 will-change-transform"
          >
            Pure Fruit Nectar<br />
            <span className="text-[#ff8a1e]">From Sunlit Orchards</span>
          </h1>
        </div>

        {/* =========================================================================
            MAIN HERO REVEAL — MOBILE BOTTOM: Description + CTA below the jar
            MOBILE ONLY (md:hidden).
           ========================================================================= */}
        <div
          className={`md:hidden absolute top-[67%] left-0 right-0 px-6 z-20 text-center ${
            ctaOpacity > 0.5 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Description */}
          <p
            style={{ opacity: descOpacity, transform: `translateY(${descY}px)` }}
            className="font-body text-[#a69888] text-xs leading-relaxed mb-4 will-change-transform"
          >
            Formulated without compromise. Pure Alphonso mango, white peach, wild alpine berry, and Sicilian lemon — extracted at low temperature, bound in pure citrus pectin.
          </p>
          {/* CTA */}
          <div
            style={{ opacity: ctaOpacity, transform: `translateY(${ctaY}px)` }}
            className="flex items-center justify-center will-change-transform"
          >
            <button
              onClick={onOpenCart}
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-[#ff8a1e] hover:bg-[#ff9c3a] text-[#0b0704] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,138,30,0.35)] cursor-pointer"
            >
              <span>EXPERIENCE NECTAR</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN HERO REVEAL — DESKTOP: Full left narrative content
            DESKTOP ONLY (hidden md:block). All content in one left-side column.
           ========================================================================= */}
        <div
          className={`hidden md:block absolute top-1/2 -translate-y-1/2 left-14 lg:left-20 z-20 max-w-sm lg:max-w-lg text-left ${
            ctaOpacity > 0.5 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Subline */}
          <div
            style={{ opacity: sublineOpacity, transform: `translateY(${sublineY}px)` }}
            className="font-tech text-sm text-[#ff8a1e] tracking-[0.25em] uppercase mb-3 flex items-center space-x-2 will-change-transform"
          >
            <span>NATURAL FRUIT PULP</span>
            <span>|</span>
            <span>ZERO ADDED SUGAR</span>
          </div>
          {/* Headline */}
          <h1
            style={{ opacity: headlineOpacity, transform: `translateY(${headlineY}px)` }}
            className="font-display fluid-hero-headline font-black tracking-tight text-[#f4ede4] mb-4 will-change-transform"
          >
            Pure Fruit Nectar<br />
            <span className="text-[#ff8a1e]">From Sunlit<br />Orchards</span>
          </h1>
          {/* Description */}
          <p
            style={{ opacity: descOpacity, transform: `translateY(${descY}px)` }}
            className="font-body text-[#a69888] text-base leading-relaxed mb-6 max-w-md will-change-transform"
          >
            Formulated without compromise. Pure Alphonso mango, white peach, wild alpine berry, and Sicilian lemon extracted at low temperature, bound in pure citrus pectin inside an apothecary crystal glass jar.
          </p>
          {/* CTA */}
          <div
            style={{ opacity: ctaOpacity, transform: `translateY(${ctaY}px)` }}
            className="flex items-center space-x-4 will-change-transform"
          >
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Experience Nectar - open cart"
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-[#ff8a1e] hover:bg-[#ff9c3a] text-[#0b0704] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,138,30,0.35)] cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>EXPERIENCE NECTAR</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN HERO REVEAL: RIGHT SPECIFICATION CALLOUT (Preserved current composition)
           ========================================================================= */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-14 lg:right-20 z-20 text-right pointer-events-none hidden md:block">
          <div
            style={{
              opacity: spec450Opacity,
              transform: `translateY(${spec450Y}px)`
            }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-[#f4ede4] leading-none mb-3 will-change-transform"
          >
            450G
          </div>
          <div
            style={{
              opacity: specDetailsOpacity,
              transform: `translateY(${specDetailsY}px)`
            }}
            className="space-y-1.5 font-tech text-xs text-[#9c8f80] uppercase tracking-wider will-change-transform"
          >
            <p>• CLEAN BOTANICAL EXTRACT</p>
            <p>• CITRUS PECTIN MATRIX</p>
            <p>• ZERO HIGH-FRUCTOSE SYRUP</p>
          </div>
        </div>


        {/* Bottom Right Floating Quick Action (Revealed smoothly along with hero) */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Quick buy now - open cart"
          style={{
            opacity: buyNowOpacity,
            transform: `translateY(${buyNowY}px)`,
            pointerEvents: buyNowOpacity > 0.5 ? 'auto' : 'none',
          }}
          className="absolute bottom-5 right-6 md:right-10 z-20 flex items-center space-x-2.5 px-5 py-2 rounded-full border border-[#ff8a1e]/40 bg-[#140e0a]/85 backdrop-blur-md hover:bg-[#ff8a1e] hover:text-[#0b0704] text-[#f4ede4] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(255,138,30,0.15)] group will-change-transform"
        >
          <ShoppingBag className="w-4 h-4 text-[#ff8a1e] group-hover:text-[#0b0704] transition-colors" />
          <span>BUY NOW</span>
        </button>


      </div>
    </section>
  );
};
