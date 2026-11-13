import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Leaf, LeafPair, Sprig, Lotus } from "../visuals/Botanicals";
import { Particles } from "../visuals/Particles";
import { Magnetic } from "../ui/Magnetic";
import { RippleButton } from "../ui/RippleButton";

interface HeroProps {
  onStart: () => void;
}

const line = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 1.0, delay: 0.15 + i * 0.16, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ onStart }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Parallax background layers */}
      <motion.div style={{ y: bgY }} className="hero-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest" />

      {/* Floating botanical art */}
      <motion.div style={{ y: artY }} className="absolute inset-0" aria-hidden="true">
        <Leaf className="anim-sway absolute left-[6%] top-[22%] h-20 w-20 text-sage/25 sm:h-28 sm:w-28" style={{ ["--sway-rot" as string]: "-14deg" } as CSSProperties} />
        <LeafPair className="anim-sway absolute right-[8%] top-[16%] h-24 w-24 text-gold/25 sm:h-32 sm:w-32" style={{ ["--sway-rot" as string]: "12deg" } as CSSProperties} />
        <Sprig className="anim-float absolute bottom-[24%] right-[16%] h-16 w-16 text-emerald-bright/30 sm:h-24 sm:w-24" />
        <Lotus className="anim-float absolute bottom-[30%] left-[10%] h-16 w-16 text-gold/20 sm:h-24 sm:w-24" style={{ animationDelay: "-4s" } as CSSProperties} />
        <Leaf className="anim-sway absolute right-[30%] top-[8%] h-12 w-12 text-sage/20" style={{ ["--sway-rot" as string]: "20deg" } as CSSProperties} />
        <Particles count={26} />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-28 pt-32 text-center"
      >
        <motion.p
          className="eyebrow-line mb-8 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold sm:text-xs"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          A College Health &amp; Wellness Survey
        </motion.p>

        <h1 className="font-display text-[10.5vw] font-medium leading-[1.06] text-ivory sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          <span className="block overflow-hidden pb-1">
            <motion.span className="block" variants={line} initial="hidden" animate="show" custom={0}>
              The future of wellness
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span className="block" variants={line} initial="hidden" animate="show" custom={1}>
              begins with <em className="gold-text font-semibold italic">ancient wisdom.</em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base font-light leading-relaxed text-sage sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
        >
          Discover how today&apos;s generation perceives Ayurveda in a rapidly evolving world.
        </motion.p>

        <motion.div
          className="mt-11 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
        >
          <Magnetic strength={14}>
            <RippleButton onClick={onStart} ariaLabel="Begin the survey">
              Explore the survey
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </RippleButton>
          </Magnetic>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-sage/70">
            15 Questions <span className="mx-1.5 text-gold">·</span> 2–3 Minutes
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-hidden="true"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.5em] text-sage/60">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-sage/20">
          <span
            className="absolute left-0 top-0 h-3 w-px bg-gold"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
