import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "motion/react";

type Variant = "gold" | "ghost" | "ivory";

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gradient-to-br from-gold-bright via-gold to-[#a9863f] text-forest-deep shadow-[0_10px_40px_-10px_rgba(199,164,93,0.55)] hover:shadow-[0_16px_50px_-8px_rgba(199,164,93,0.7)]",
  ghost:
    "glass text-ivory hover:border-gold/40 hover:bg-white/[0.08] hover:shadow-[0_10px_30px_-12px_rgba(199,164,93,0.3)]",
  ivory: "bg-ivory text-forest-deep hover:bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]",
};

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/** Premium button with ripple effect + spring press/hover physics. */
export function RippleButton({
  children,
  onClick,
  variant = "gold",
  className = "",
  disabled,
  type = "button",
  ariaLabel,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = nextId.current++;
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.();
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? undefined : { scale: 1.03, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${VARIANTS[variant]} ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
            animation: "ripple-expand 0.65s ease-out forwards",
          }}
        />
      ))}
      {children}
      <style>{`@keyframes ripple-expand { from { opacity: 0.5; transform: translate(-50%,-50%) scale(0); } to { opacity: 0; transform: translate(-50%,-50%) scale(26); } }`}</style>
    </motion.button>
  );
}
