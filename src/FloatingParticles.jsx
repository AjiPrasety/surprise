import React, { useMemo } from 'react';

const ICONS = ['🌸', '🌷', '✨', '🐾', '⭐', '💫', '🌺', '🎀', '💕', '🌟'];

export default function FloatingParticles({ count = 28 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const icon = ICONS[i % ICONS.length];
      const left = Math.random() * 100;           // % of viewport width
      const delay = Math.random() * 12;            // seconds
      const duration = 8 + Math.random() * 14;    // 8–22s
      const size = 14 + Math.random() * 22;        // 14–36px
      const startBottom = -(Math.random() * 10);  // just below fold

      return { id: i, icon, left, delay, duration, size, startBottom };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle select-none"
          style={{
            left: `${p.left}%`,
            bottom: `${p.startBottom}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.45))',
          }}
        >
          {p.icon}
        </span>
      ))}

      {/* Static twinkling stars in corners */}
      <span className="absolute top-[8%]  left-[5%]  text-3xl animate-star" style={{ animationDelay: '0s' }}>⭐</span>
      <span className="absolute top-[12%] right-[7%] text-2xl animate-star" style={{ animationDelay: '0.7s' }}>✨</span>
      <span className="absolute top-[25%] left-[3%]  text-xl  animate-star" style={{ animationDelay: '1.4s' }}>💫</span>
      <span className="absolute top-[30%] right-[4%] text-2xl animate-star" style={{ animationDelay: '0.4s' }}>🌟</span>
      <span className="absolute bottom-[18%] left-[6%]  text-2xl animate-star" style={{ animationDelay: '2s' }}>✨</span>
      <span className="absolute bottom-[22%] right-[5%] text-xl  animate-star" style={{ animationDelay: '1.1s' }}>⭐</span>
    </div>
  );
}
