import { motion } from "motion/react";
import { ShieldCheck, X, Clock, EyeOff, UserX, Database } from "lucide-react";
import { RippleButton } from "../ui/RippleButton";

interface PrivacyNoticeProps {
  onClose: () => void;
  onBegin: () => void;
}

const POINTS = [
  { icon: UserX, title: "Completely anonymous", text: "We never ask for your name, email, phone number or college ID." },
  { icon: Clock, title: "Timestamp only", text: "Each response stores the date and time it was submitted." },
  { icon: Database, title: "One response per device", text: "A random anonymous token prevents accidental duplicate submissions." },
  { icon: EyeOff, title: "Responses stay private", text: "Individual answers are never shown publicly. Only aggregated results are reported." },
];

export function PrivacyNotice({ onClose, onBegin }: PrivacyNoticeProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-forest-deep/80 p-4 backdrop-blur-md sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
    >
      <motion.div
        className="glass-strong w-full max-w-lg rounded-[1.75rem] p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] sm:p-9"
        initial={{ y: 60, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald/20 text-emerald-bright">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy notice"
            className="rounded-full p-2 text-sage/70 transition-colors hover:bg-white/10 hover:text-ivory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 id="privacy-title" className="font-display text-3xl font-semibold text-ivory">
          Before we begin
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-sage">
          Your privacy, in plain words:
        </p>

        <ul className="mt-6 space-y-4">
          {POINTS.map((p, i) => (
            <motion.li
              key={p.title}
              className="flex items-start gap-3.5"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-gold">
                <p.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory">{p.title}</p>
                <p className="text-xs leading-relaxed text-sage/85">{p.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8">
          <RippleButton onClick={onBegin} className="w-full">
            I understand — begin survey
          </RippleButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
