import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Option } from "../../data/questions";

interface OptionCardProps {
  option: Option;
  index: number;
  selected: boolean;
  mode: "radio" | "check";
  onSelect: () => void;
}

const LETTERS = "ABCDEFGHIJ";

/**
 * A premium selectable card — glowing emerald/gold border when selected,
 * custom animated radio or checkbox indicator, spring hover physics.
 */
export function OptionCard({ option, index, selected, mode, onSelect }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      role={mode === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      whileHover={{ y: -2, x: 2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left backdrop-blur-md transition-colors duration-300 sm:gap-5 sm:px-6 sm:py-4.5 ${
        selected
          ? "border-emerald-bright/80 bg-emerald/20 shadow-[0_0_0_1px_rgba(31,158,111,0.4),0_0_28px_-4px_rgba(31,158,111,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-white/10 bg-white/[0.045] hover:border-gold/45 hover:bg-white/[0.08] hover:shadow-[0_12px_34px_-18px_rgba(199,164,93,0.45)]"
      }`}
    >
      {/* selected edge glow wash */}
      <motion.span
        className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-gold-bright via-gold to-emerald-bright"
        initial={false}
        animate={{ opacity: selected ? 1 : 0, scaleY: selected ? 1 : 0.3 }}
        transition={{ duration: 0.35 }}
      />

      {/* indicator */}
      {mode === "radio" ? (
        <span
          className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
            selected ? "border-emerald-bright bg-emerald-bright/15" : "border-white/25 group-hover:border-gold/60"
          }`}
        >
          <motion.span
            className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-gold-bright to-gold"
            initial={false}
            animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
          />
        </span>
      ) : (
        <span
          className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-300 ${
            selected ? "border-gold bg-gold/20" : "border-white/25 group-hover:border-gold/60"
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
            <motion.path
              d="M3 8.5 L6.5 12 L13 4.5"
              fill="none"
              stroke="#E3C886"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </svg>
        </span>
      )}

      {/* letter chip */}
      <span
        className={`hidden font-display text-sm italic transition-colors duration-300 sm:block ${
          selected ? "text-gold-bright" : "text-sage/50 group-hover:text-gold/70"
        }`}
        aria-hidden="true"
      >
        {LETTERS[index] ?? ""}
      </span>

      <span
        className={`flex-1 text-[15px] font-medium leading-snug transition-colors duration-300 sm:text-base ${
          selected ? "text-ivory" : "text-ivory/85 group-hover:text-ivory"
        }`}
      >
        {option.label}
      </span>

      {selected && <Check className="h-4 w-4 shrink-0 text-emerald-bright" aria-hidden="true" />}
    </motion.button>
  );
}
