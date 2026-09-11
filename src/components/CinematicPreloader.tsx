import React, { useState, useEffect, useRef } from 'react';

interface CinematicPreloaderProps {
  onComplete: () => void;
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(
        sessionStorage.getItem('nector_preloader_shown') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
    return false;
  });
  const [isFading, setIsFading] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Check if previously viewed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('nector_preloader_shown')) {
      setIsDone(true);
      onCompleteRef.current();
      return;
    }

    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('nector_preloader_shown', 'true');
      setIsDone(true);
      onCompleteRef.current();
      return;
    }

    let timer1: ReturnType<typeof setTimeout> | null = null;
    let timer2: ReturnType<typeof setTimeout> | null = null;

    // Smooth simulated loading progression
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Accelerate towards 100%
      const increment = Math.max(1, Math.floor(Math.random() * 8) + 2);
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);

        sessionStorage.setItem('nector_preloader_shown', 'true');

        // Short pause at 100% for impact, then start curtain wipe
        timer1 = setTimeout(() => {
          setIsFading(true);
          onCompleteRef.current(); // Signal jar settle-in under dissolving curtain
          timer2 = setTimeout(() => {
            setIsDone(true);
            onCompleteRef.current();
          }, 850);
        }, 350);
      } else {
        setProgress(currentProgress);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, []);

  if (isDone) return null;

  const brandLetters = ['N', 'É', 'C', 'T', 'A', 'R'];

  return (
    <div
      role="status"
      aria-label="Loading NÉCTAR Experience"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030201] text-[#f4ede4] transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isFading ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Amber Orchard Glow */}
      <div className="absolute inset-0 bg-radial-hero opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Origin Pill */}
        <div className="mb-8 inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-[#ff8a1e]/30 bg-[#160e08]/70 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a1e] animate-ping" />
          <span className="font-tech text-[10px] tracking-[0.3em] text-[#ff8a1e] uppercase">
            FROM THE ORCHARD
          </span>
        </div>

        {/* Staggered Brand Lettering */}
        <h1 className="font-display text-5xl sm:text-7xl font-black tracking-[0.25em] text-[#f4ede4] mb-6 flex space-x-2 sm:space-x-4 pl-[0.25em]">
          {brandLetters.map((char, index) => (
            <span
              key={index}
              style={{
                animationDelay: `${index * 90}ms`,
                opacity: progress > index * 14 ? 1 : 0.15,
                transform: progress > index * 14 ? 'translateY(0)' : 'translateY(12px)',
              }}
              className="inline-block transition-all duration-500 will-change-transform"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="font-tech text-xs tracking-[0.3em] text-[#9c8f80] uppercase mb-10">
          ARTISANAL SUN-DRIED GOURMET CONFECTION
        </p>

        {/* Minimal Gold Progress Bar */}
        <div className="w-48 sm:w-64 h-[2px] bg-[#1a120c] rounded-full overflow-hidden mb-4 relative">
          <div
            className="h-full bg-gradient-to-r from-[#ff8a1e]/40 via-[#ffaa33] to-[#ff8a1e] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,170,51,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex items-center justify-between w-48 sm:w-64 font-tech text-xs text-[#ff8a1e]">
          <span className="text-[10px] text-[#9c8f80] tracking-widest uppercase">INITIALIZING</span>
          <span className="font-bold tabular-nums tracking-widest">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicPreloader;
