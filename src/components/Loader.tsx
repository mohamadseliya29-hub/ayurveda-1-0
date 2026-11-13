import { useEffect } from "react";
import { motion } from "motion/react";
import { Leaf, LeafPair, Sprig } from "./visuals/Botanicals";

const TITLE = "AYURVEDA".split("");

/**
 * Cinematic ~2.4s intro: dark forest → golden glow → emerging botanicals →
 * title + tagline → fade into the homepage.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(onDone, reduced ? 700 : 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-forest-deep"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-label="Loading Ayurveda 2.0"
    >
      {/* Golden glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full anim-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(199,164,93,0.20) 0%, rgba(22,122,85,0.10) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />

      {/* Botanical leaves emerging from corners */}
      <motion.div className="absolute -left-6 -top-8 text-sage/50 anim-sway" style={{ ["--sway-rot" as string]: "-12deg" }}
        initial={{ x: -80, y: -60, opacity: 0, rotate: -40 }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <LeafPair className="h-28 w-28 sm:h-40 sm:w-40" />
      </motion.div>
      <motion.div className="absolute -right-8 top-10 text-gold/40 anim-sway" style={{ ["--sway-rot" as string]: "10deg" }}
        initial={{ x: 80, y: -40, opacity: 0, rotate: 45 }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <Sprig className="h-24 w-24 sm:h-32 sm:w-32" />
      </motion.div>
      <motion.div className="absolute -bottom-10 left-1/4 text-emerald/60" style={{ ["--sway-rot" as string]: "6deg" }}
        initial={{ y: 80, opacity: 0, rotate: 20 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <Leaf className="h-32 w-32 sm:h-44 sm:w-44 anim-sway" />
      </motion.div>
      <motion.div className="absolute -bottom-8 right-[12%] text-gold/30" style={{ ["--sway-rot" as string]: "-8deg" }}
        initial={{ y: 70, opacity: 0, rotate: -25 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <LeafPair className="h-20 w-20 sm:h-28 sm:w-28 -scale-x-100 anim-sway" />
      </motion.div>

      {/* Title */}
      <div className="relative z-10 px-6 text-center">
        <div className="flex items-end justify-center overflow-hidden">
          {TITLE.map((ch, i) => (
            <motion.span
              key={i}
              className="font-display text-[11vw] font-semibold leading-none tracking-[0.06em] text-ivory sm:text-6xl md:text-7xl"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span
            className="font-display gold-text text-[11vw] font-semibold italic leading-none sm:text-6xl md:text-7xl"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            &nbsp;2.0
          </motion.span>
        </div>

        <motion.p
          className="mt-5 text-[11px] font-medium uppercase tracking-[0.42em] text-sage sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45 }}
        >
          Ancient Wisdom <span className="text-gold">·</span> Modern Wellness
        </motion.p>

        {/* Fine gold rule */}
        <motion.div
          className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        />
      </div>
    </motion.div>
  );
}
