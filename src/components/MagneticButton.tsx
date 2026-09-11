import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  enableBurst?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  enableBurst = true,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;

    // Clamp displacement to maximum ~8px
    const clampedX = Math.max(-8, Math.min(8, deltaX));
    const clampedY = Math.max(-8, Math.min(8, deltaY));

    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableBurst && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const originX = e.clientX - rect.left;
        const originY = e.clientY - rect.top;

        const colors = ['#ffaa33', '#ff8a1e', '#e0b99b', '#ffd700', '#7fa860'];
        const newParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
          const speed = 28 + Math.random() * 20;
          return {
            id: Date.now() + i,
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[i % colors.length],
          };
        });

        setParticles(newParticles);
        setTimeout(() => setParticles([]), 420);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.08s ease-out',
      }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}

      {/* Particle Burst Elements */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            backgroundColor: p.color,
            transform: `translate(${p.vx}px, ${p.vy}px) scale(0)`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
          }}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none opacity-90 shadow-[0_0_6px_rgba(255,170,51,0.8)]"
        />
      ))}
    </button>
  );
};
