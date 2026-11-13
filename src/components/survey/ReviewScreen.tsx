import { motion } from "motion/react";
import { ArrowLeft, Pencil, Loader2, Send, AlertTriangle } from "lucide-react";
import { QUESTIONS } from "../../data/questions";
import { RippleButton } from "../ui/RippleButton";
import { Sprig } from "../visuals/Botanicals";
import type { AnswerMap } from "../../lib/supabase";

interface ReviewScreenProps {
  answers: AnswerMap;
  onEdit: (questionIndex: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error?: string | null;
}

function answerText(a: string | string[] | undefined): string[] | null {
  if (a === undefined) return null;
  if (Array.isArray(a)) return a.length ? a : null;
  const t = a.trim();
  return t ? [t] : null;
}

export function ReviewScreen({ answers, onEdit, onSubmit, submitting, error }: ReviewScreenProps) {
  const answeredCount = QUESTIONS.filter((q) => answerText(answers[q.id]) !== null).length;

  return (
    <div className="relative min-h-[100svh] overflow-hidden px-5 py-14 sm:px-8">
      <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      <Sprig className="anim-sway absolute -right-8 top-10 h-48 w-48 text-gold/10" />

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="eyebrow-line mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-gold sm:text-xs">
            Final Step
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.12] text-ivory sm:text-6xl">
            Your perspective <em className="gold-text font-semibold italic">matters.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-sage sm:text-base">
            One last look before we record your voice. Tap <em className="italic text-gold/90">edit</em> to change
            anything.
          </p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-bright">
            {answeredCount} / {QUESTIONS.length} answered
          </p>
        </motion.div>

        {/* summary */}
        <div className="mt-10 space-y-3">
          {QUESTIONS.map((q, i) => {
            const ans = answerText(answers[q.id]);
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                className="glass group flex items-start gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-gold/30"
              >
                <span className="mt-0.5 font-display text-lg italic text-gold/80">
                  {String(q.id).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-ivory/90">{q.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ans ? (
                      ans.map((a) => (
                        <span
                          key={a}
                          className="rounded-full border border-emerald-bright/40 bg-emerald/15 px-2.5 py-0.5 text-[11px] font-medium text-ivory/90"
                        >
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-medium italic text-sage/50">skipped</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onEdit(i)}
                  aria-label={`Edit question ${q.id}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage transition-all hover:border-gold/50 hover:text-gold"
                >
                  <Pencil className="h-3 w-3" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-gold-bright"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div
          className="mt-9 flex flex-col items-center gap-4 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <RippleButton onClick={onSubmit} disabled={submitting} className="min-w-[15rem]">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit survey
                <Send className="h-4 w-4" />
              </>
            )}
          </RippleButton>
          <button
            onClick={() => onEdit(0)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sage/70 transition-colors hover:text-ivory"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to questions
          </button>
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.28em] text-sage/40">
            Anonymous · No personal data collected
          </p>
        </motion.div>
      </div>
    </div>
  );
}
