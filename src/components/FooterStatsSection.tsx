import React from 'react';
import { FOOTER_STATS, BRAND_NAME, BRAND_TAGLINE } from '../data/productData';
import { ASSETS } from '../assets/images';
import { useInView } from '../lib/useInView';
import { MagneticButton } from './MagneticButton';

const StatCounter: React.FC<{ valueStr: string; isActive: boolean }> = ({ valueStr, isActive }) => {
  const [displayVal, setDisplayVal] = React.useState(valueStr === 'ZERO' ? 'ZERO' : '0');

  React.useEffect(() => {
    if (!isActive) return;

    // Check if numeric or has suffix like "450G", "100%", "5"
    const match = valueStr.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayVal(valueStr);
      return;
    }

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2] || '';

    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * targetNum);
      setDisplayVal(`${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayVal(`${targetNum}${suffix}`);
      }
    };

    requestAnimationFrame(update);
  }, [isActive, valueStr]);

  return <span>{displayVal}</span>;
};

export const FooterStatsSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#080503] text-[#f4ede4] border-t border-[#1f1711] overflow-hidden pt-24 pb-8">
      
      {/* Background Soft Gourmet Pedestal Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial-pedestal opacity-20 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Summary & Visual */}
        <div className={`text-center max-w-2xl mx-auto mb-16 space-y-4 reveal-fade-up ${isInView ? 'is-revealed' : ''}`}>
          <span className="font-tech text-xs text-[#ff8a1e] tracking-[0.25em] uppercase">
            Pure Botanical Formulation
          </span>
          <h2 className="font-display fluid-section-headline font-black tracking-tight text-[#f4ede4]">
            Refreshing Purity
          </h2>
          <p className="font-body text-[#9c8f80] text-sm md:text-base leading-relaxed">
            {BRAND_NAME} is about getting more from natural fruit. Slow cold-reduced, non-GMO, vegan citrus pectin, and uncompromised artisanal craftsmanship.
          </p>

          {/* Centered Small Jar Visual */}
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
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-[#1e150f] text-center reveal-fade-up delay-150 ${isInView ? 'is-revealed' : ''}`}>
          {FOOTER_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center space-y-1.5 group">
              <span className="font-display fluid-stat-num font-black tracking-tight text-[#ff8a1e] group-hover:scale-105 transition-transform duration-300">
                <StatCounter valueStr={stat.value} isActive={isInView} />
              </span>
              {/* Gold foil drawing underline */}
              <div
                className={`h-[2px] bg-gradient-to-r from-transparent via-[#ffaa33] to-transparent transition-all duration-1000 ${
                  isInView ? 'w-16 opacity-100' : 'w-0 opacity-0'
                }`}
              />
              <span className="font-tech text-xs sm:text-sm font-semibold tracking-widest text-[#f4ede4] uppercase pt-1">
                {stat.label}
              </span>
              <span className="font-body text-[11px] text-[#9c8f80] max-w-[180px] leading-snug">
                {stat.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Editorial Newsletter Subscription */}
        <div className="py-14 border-b border-[#1e150f] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-1.5 max-w-md">
            <span className="font-tech text-xs tracking-[0.2em] text-[#ff8a1e] uppercase">Private Reserve Allocation</span>
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#f4ede4]">Join the Harvest Connoisseurs</h4>
            <p className="font-body text-xs sm:text-sm text-[#9c8f80]">
              Receive first access to seasonal single-origin batch releases and private tasting invitations.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            {subscribed ? (
              <div className="px-6 py-3 rounded-full bg-[#1b2b1a] border border-[#48bb78]/40 text-[#a3e635] text-xs font-tech tracking-wider uppercase">
                ✓ Allocation Confirmed. Welcome to NÉCTAR Reserve.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your personal email"
                  aria-label="Email for harvest newsletter"
                  className="w-full sm:w-72 px-5 py-3 rounded-full bg-[#130d09] border border-[#2d1c12] focus:border-[#ff8a1e] text-xs font-body text-[#f4ede4] placeholder-[#6b5d50] focus:outline-none transition-colors"
                />
                <MagneticButton
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#ff8a1e] hover:bg-[#ffaa33] text-[#0b0704] text-xs font-display font-bold tracking-wider uppercase transition-colors"
                >
                  SUBSCRIBE
                </MagneticButton>
              </>
            )}
          </form>
        </div>

        {/* Gourmet Certifications Row */}
        <div className="py-8 border-b border-[#1a120c] flex flex-wrap justify-center items-center gap-6 sm:gap-12 font-tech text-[10px] tracking-[0.2em] text-[#786a5b] uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa33]/60" />
            GMP CERTIFIED LABS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa33]/60" />
            100% BOTANICAL EXTRACTS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa33]/60" />
            COLD-SEAL FRESHNESS VERIFIED
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa33]/60" />
            NON-GMO & ZERO SYNTHETICS
          </span>
        </div>

        {/* Legal Links Row */}
        <div className="pt-8 pb-6 flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-tech text-xs tracking-wider uppercase text-[#9c8f80]">
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
        <div className="pt-6 pb-12 border-t border-[#1a120c] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9c8f80] font-tech space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} {BRAND_NAME} Confectionery Co. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-[#9c8f80]/80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>AGENCY-GRADE SCROLL ARCHITECTURE // A-GRADE BUILD</span>
          </div>
        </div>

      </div>

      {/* Oversized Brand Typography Finale */}
      <div className="w-full overflow-hidden text-center select-none pt-4 pb-0 pointer-events-auto">
        <div
          aria-label={BRAND_NAME}
          className="inline-flex justify-center items-center tracking-[-0.04em] font-display font-black text-[18vw] sm:text-[19vw] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-[#24170e] via-[#150e09] to-[#080503] transition-colors duration-500 hover:from-[#ff8a1e]/40 hover:via-[#ffaa33]/20 hover:to-[#120b07]"
        >
          {['N', 'É', 'C', 'T', 'A', 'R'].map((letter, idx) => (
            <span
              key={idx}
              className="inline-block transition-transform duration-300 hover:-translate-y-4 hover:scale-105 hover:text-[#ffaa33] cursor-default"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
