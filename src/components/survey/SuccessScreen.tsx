import { useEffect } from "react";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { Mandala, Leaf, LeafPair } from "../visuals/Botanicals";
import { Particles, PetalRain } from "../visuals/Particles";
import { Magnetic } from "../ui/Magnetic";
import { RippleButton } from "../ui/RippleButton";

interface SuccessScreenProps {
  onHome: () => void;
}

export function SuccessScreen({ onHome }: SuccessScreenProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-forest-deep px-6 py-16 text-center">
      {/* background transition wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(22,122,85,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(199,164,93,0.14), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <PetalRain count={16} />
      <Particles count={20} maxOpacity={0.45} />

      {/* rotating mandala */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <Mandala className="anim-spin-slow h-[130vmin] w-[130vmin] opacity-[0.10]" />
      </div>

      <div className="relative z-10">
        {/* golden botanical ring + checkmark */}
        <motion.div
          className="relative mx-auto mb-10 h-36 w-36 sm:h-44 sm:w-44"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
        >
          <div className="absolute -inset-6 rounded-full bg-gold/10 blur-2xl anim-glow" aria-hidden="true" />
          <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="success-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E3C886" />
                <stop offset="100%" stopColor="#C7A45D" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="url(#success-ring)"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path
              d="M40 62 L54 76 L82 45"
              fill="none"
              stroke="#E3C886"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 1.05, ease: "easeOut" }}
            />
          </svg>
          <Leaf className="absolute -left-3 top-2 h-9 w-9 text-gold/50" style={{ rotate: "-30deg" }} />
          <LeafPair className="absolute -right-4 bottom-3 h-9 w-9 text-gold/40 -scale-x-100" />
        </motion.div>

        <motion.h1
          className="mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.15] text-ivory sm:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          Thank you for being part of <em className="gold-text font-semibold italic">the change.</em>
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-sage sm:text-lg"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
        >
          Your voice helps us understand how ancient wisdom fits into modern wellness.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-11"
        >
          <Magnetic strength={12}>
            <RippleButton onClick={onHome} variant="ghost">
              <Home className="h-4 w-4" />
              Return to homepage
            </RippleButton>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
