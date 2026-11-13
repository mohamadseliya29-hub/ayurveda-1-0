import { useMemo } from "react";

interface ParticlesProps {
  count?: number;
  className?: string;
  /** 0–1 */
  maxOpacity?: number;
}

interface ParticleStyle {
  left: string;
  top: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: string;
  driftY: string;
  color: string;
  blur: number;
}

const COLORS = ["rgba(184,205,183,0.9)", "rgba(199,164,93,0.9)", "rgba(31,158,111,0.75)", "rgba(247,243,233,0.8)"];

function makeParticles(count: number, maxOpacity: number): ParticleStyle[] {
  const styles: ParticleStyle[] = [];
  for (let i = 0; i < count; i++) {
    const size = 2 + Math.random() * 5;
    styles.push({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size,
      opacity: maxOpacity * (0.35 + Math.random() * 0.65),
      duration: 14 + Math.random() * 18,
      delay: -Math.random() * 20,
      driftX: `${(Math.random() - 0.2) * 90}px`,
      driftY: `${-(60 + Math.random() * 140)}px`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      blur: Math.random() > 0.6 ? 1.5 : 0,
    });
  }
  return styles;
}

/**
 * Lightweight CSS-only particle field. Particles drift upward like pollen.
 * Deterministic per mount via useMemo so re-renders don't reshuffle.
 */
export function Particles({ count = 22, className = "", maxOpacity = 0.6 }: ParticlesProps) {
  const particles = useMemo(() => makeParticles(count, maxOpacity), [count, maxOpacity]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            opacity: 0,
            ["--particle-opacity" as string]: p.opacity,
            ["--drift-x" as string]: p.driftX,
            ["--drift-y" as string]: p.driftY,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/** Golden petals gently falling — used on the success screen. */
export function PetalRain({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: `${4 + Math.random() * 92}%`,
        size: 8 + Math.random() * 10,
        duration: 7 + Math.random() * 8,
        delay: -Math.random() * 10,
        driftX: `${(Math.random() - 0.5) * 120}px`,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute top-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.6,
            opacity: p.opacity,
            ["--drift-x" as string]: p.driftX,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          <path d="M12 2 C18 8 18 16 12 22 C6 16 6 8 12 2 Z" fill="#C7A45D" />
        </svg>
      ))}
    </div>
  );
}
