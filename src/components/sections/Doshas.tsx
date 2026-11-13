import { motion } from "motion/react";
import { Wind, Flame, Mountain, Info } from "lucide-react";
import { DOSHAS } from "../../data/doshas";
import { DoshaArt } from "../visuals/Botanicals";

const CARD_ART: Record<string, { icon: typeof Wind; gradient: string; ring: string }> = {
  vata: {
    icon: Wind,
    gradient: "from-[#eef2ea] via-[#dce7d8] to-[#c4d6c3]",
    ring: "group-hover:ring-sage",
  },
  pitta: {
    icon: Flame,
    gradient: "from-[#f7efdc] via-[#ecd9ae] to-[#d9b877]",
    ring: "group-hover:ring-gold",
  },
  kapha: {
    icon: Mountain,
    gradient: "from-[#e3ede2] via-[#bcd3bf] to-[#8fb499]",
    ring: "group-hover:ring-emerald",
  },
};

const reveal = {
  hidden: { opacity: 0, y: 42 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Doshas() {
  return (
    <section id="doshas" className="relative overflow-hidden bg-ivory py-24 text-forest sm:py-32">
      {/* soft organic wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 110% -10%, rgba(22,122,85,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at -10% 110%, rgba(199,164,93,0.12), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <motion.p
            className="eyebrow-line mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-emerald sm:text-xs"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            The Three Doshas
          </motion.p>
          <motion.h2
            className="font-display text-4xl font-medium leading-[1.12] text-forest sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, delay: 0.08 }}
          >
            Ancient principles, <br />
            <em className="italic text-emerald">modern balance.</em>
          </motion.h2>
          <motion.p
            className="mt-6 text-base leading-relaxed text-forest/70 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.16 }}
          >
            Ayurveda describes three fundamental energies that shape every body and mind.
            Explore them below — then tell us what <em className="italic">you</em> think of the science behind them.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-7">
          {DOSHAS.map((d, i) => {
            const art = CARD_ART[d.key];
            const Icon = art.icon;
            return (
              <motion.article
                key={d.key}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`group relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_-24px_rgba(16,43,35,0.25)] ring-1 ring-forest/5 transition-shadow duration-500 hover:shadow-[0_34px_80px_-28px_rgba(16,43,35,0.38)] hover:ring-2 ${art.ring}`}
              >
                {/* gradient header */}
                <div className={`relative mb-7 flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${art.gradient}`}>
                  <DoshaArt
                    dosha={d.key}
                    className="h-32 w-32 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3 sm:h-36 sm:w-36"
                  />
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
                    <Icon className="h-4.5 w-4.5 text-forest/80" />
                  </span>
                  <span className="absolute bottom-3 left-5 font-display text-sm italic text-forest/60">
                    {d.elements}
                  </span>
                </div>

                <p className="font-display text-lg italic text-gold">{d.sanskrit}</p>
                <h3 className="mt-1 font-display text-3xl font-semibold text-forest">
                  {d.name.toUpperCase()}
                </h3>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald">
                  {d.title}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-forest/70">{d.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {d.traits.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-forest/10 bg-ivory px-3 py-1 text-[11px] font-semibold text-forest/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-forest/10 bg-white/60 px-5 py-4 text-xs leading-relaxed text-forest/60 sm:text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
          <span>
            Vata, Pitta and Kapha are traditional Ayurvedic concepts describing constitutional types.
            They are presented here for cultural and educational context only and are{" "}
            <strong className="font-semibold text-forest/80">not medical diagnoses</strong>.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
