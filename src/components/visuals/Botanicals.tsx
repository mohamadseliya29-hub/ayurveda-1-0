import { useId, type CSSProperties } from "react";

interface ArtProps {
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

const GOLD = "#C7A45D";
const SAGE = "#B8CDB7";
const EMERALD = "#167A55";

/** Single elegant leaf with midrib. */
export function Leaf({ className, strokeWidth = 1.5, style }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M32 4 C46 10 52 26 46 42 C42 52 36 58 32 60 C28 58 22 52 18 42 C12 26 18 10 32 4 Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path d="M32 9 L32 55" stroke="currentColor" strokeWidth={strokeWidth * 0.66} strokeLinecap="round" />
      <path d="M32 20 C36 22 39 25 41 29 M32 30 C36 32 39 35 41 39 M32 20 C28 22 25 25 23 29 M32 30 C28 32 25 35 23 39"
        stroke="currentColor" strokeWidth={strokeWidth * 0.5} strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/** Two leaves on a curved stem. */
export function LeafPair({ className, strokeWidth = 1.5, style }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M32 58 C30 44 31 30 34 14" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <path d="M33 26 C24 22 20 14 21 6 C30 9 34 17 33 26 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 40 C41 38 46 31 46 22 C37 24 32 31 32 40 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="34" cy="10" r="1.6" fill="currentColor" />
      <circle cx="31" cy="17" r="1.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Tulsi-style sprig with leaflets. */
export function Sprig({ className, strokeWidth = 1.4, style }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M32 60 C31 44 32 26 32 8" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <path d="M32 18 C26 16 22 11 22 5 C28 7 32 12 32 18 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 18 C38 16 42 11 42 5 C36 7 32 12 32 18 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 34 C25 33 20 28 19 21 C26 23 31 28 32 34 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 34 C39 33 44 28 45 21 C38 23 33 28 32 34 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 48 C27 47 23 43 23 38 C28 40 31 43 32 48 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 48 C37 47 41 43 41 38 C36 40 33 43 32 48 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

/** Minimal lotus. */
export function Lotus({ className, strokeWidth = 1.5, style }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M32 6 C38 17 38 32 32 41 C26 32 26 17 32 6 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 41 C24 36 18 25 19 14 C28 20 33 30 32 41 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 41 C40 36 46 25 45 14 C36 20 31 30 32 41 Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M32 43 C24 42 14 40 9 34 C17 33 27 36 32 43 Z" stroke="currentColor" strokeWidth={strokeWidth * 0.85} strokeLinejoin="round" opacity="0.85" />
      <path d="M32 43 C40 42 50 40 55 34 C47 33 37 36 32 43 Z" stroke="currentColor" strokeWidth={strokeWidth * 0.85} strokeLinejoin="round" opacity="0.85" />
      <path d="M14 50 C25 55 39 55 50 50" stroke="currentColor" strokeWidth={strokeWidth * 0.7} strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/** Rotating mandala ring — used on the success screen and loader. */
export function Mandala({ className, strokeWidth = 1 }: ArtProps) {
  const id = useId();
  const petal = "M32 4 C36 12 36 20 32 27 C28 20 28 12 32 4 Z";
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E3C886" />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="27" stroke={`url(#${id})`} strokeWidth={strokeWidth} opacity="0.5" />
      <circle cx="32" cy="32" r="20" stroke={`url(#${id})`} strokeWidth={strokeWidth * 0.7} opacity="0.35" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={petal} stroke={`url(#${id})`} strokeWidth={strokeWidth} strokeLinejoin="round"
          transform={`rotate(${i * 30} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="4" fill={`url(#${id})`} opacity="0.9" />
    </svg>
  );
}

/** Abstract art for the three doshas. */
export function DoshaArt({ dosha, className }: { dosha: "vata" | "pitta" | "kapha"; className?: string }) {
  const id = useId();
  if (dosha === "vata") {
    return (
      <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={SAGE} />
            <stop offset="100%" stopColor={EMERALD} />
          </linearGradient>
        </defs>
        <path d="M16 44 C40 30 64 52 88 38 C98 32 104 34 110 40" stroke={`url(#${id})`} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M12 62 C38 48 62 70 88 56 C98 50 104 52 110 58" stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <path d="M20 80 C42 68 62 86 84 74 C94 68 102 70 106 76" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        <path d="M84 24 C92 20 100 22 104 28 C98 32 88 32 84 24 Z" stroke={SAGE} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M20 96 C28 92 36 94 40 100 C34 104 24 104 20 96 Z" stroke={SAGE} strokeWidth="1.4" strokeLinejoin="round" opacity="0.6" />
      </svg>
    );
  }
  if (dosha === "pitta") {
    return (
      <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E3C886" />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <path d="M60 14 C76 32 80 46 72 60 C80 58 84 50 85 44 C94 60 86 82 68 90 C76 86 78 78 74 72 C64 82 52 82 46 74 C38 84 44 96 54 100 C36 100 22 84 26 66 C30 52 40 46 44 36 C46 46 50 50 56 52 C48 40 52 26 60 14 Z"
          stroke={`url(#${id})`} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M60 52 C66 60 66 70 60 76 C54 70 54 60 60 52 Z" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round" opacity="0.8" />
        <circle cx="60" cy="104" r="2" fill={GOLD} />
        <circle cx="46" cy="100" r="1.4" fill={GOLD} opacity="0.6" />
        <circle cx="74" cy="100" r="1.4" fill={GOLD} opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={EMERALD} />
          <stop offset="100%" stopColor={SAGE} />
        </linearGradient>
      </defs>
      <path d="M60 16 C66 26 66 34 60 39 C54 34 54 26 60 16 Z" stroke={`url(#${id})`} strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 76 Q38 46 60 66 Q82 46 106 76" stroke={`url(#${id})`} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M28 92 Q44 72 60 84 Q76 72 92 92" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d="M42 106 Q52 96 60 102 Q68 96 78 106" stroke={`url(#${id})`} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <circle cx="88" cy="30" r="1.6" fill={SAGE} />
      <circle cx="30" cy="36" r="1.2" fill={SAGE} opacity="0.7" />
    </svg>
  );
}

/** Small botanical accent used on survey question screens (cycles per question). */
export function QuestionAccent({ index, className }: { index: number; className?: string }) {
  const variants = [Leaf, Sprig, LeafPair, Lotus];
  const Cmp = variants[index % variants.length];
  return <Cmp className={className} />;
}
