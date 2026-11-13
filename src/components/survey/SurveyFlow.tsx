import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ClipboardList, RotateCcw } from "lucide-react";
import { QUESTIONS, TOTAL_QUESTIONS, type Question } from "../../data/questions";
import { OptionCard } from "./OptionCard";
import { QuestionAccent } from "../visuals/Botanicals";
import { RippleButton } from "../ui/RippleButton";
import { loadDraft, saveDraft } from "../../lib/storage";
import type { AnswerMap } from "../../lib/supabase";

interface SurveyFlowProps {
  onFinish: (answers: AnswerMap) => void;
  onExit: () => void;
  /** Jump directly to a 0-based question index (used by review "edit"). */
  initialStep?: number;
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 70, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, x: dir * -70, filter: "blur(4px)" }),
};

function isAnswered(q: Question, a: string | string[] | undefined): boolean {
  if (q.type === "text") return true; // optional
  if (a === undefined) return false;
  return Array.isArray(a) ? a.length > 0 : true;
}

export function SurveyFlow({ onFinish, onExit, initialStep = 0 }: SurveyFlowProps) {
  const [step, setStep] = useState(initialStep);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<AnswerMap>(() => loadDraft() ?? {});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const q = QUESTIONS[step];
  const current = answers[q.id];
  const answered = isAnswered(q, current);
  const isLast = step === TOTAL_QUESTIONS - 1;
  const pct = Math.round(((step + 1) / TOTAL_QUESTIONS) * 100);

  useEffect(() => {
    saveDraft(answers);
  }, [answers]);

  // Move focus to the question heading on every step change (a11y)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const go = useCallback(
    (next: number, direction: number) => {
      window.clearTimeout(advanceTimer.current);
      setDir(direction);
      setStep(Math.max(0, Math.min(TOTAL_QUESTIONS - 1, next)));
    },
    [],
  );

  function selectSingle(qid: number, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
    // Premium flow: brief pause so the selection is acknowledged, then advance
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      const idx = QUESTIONS.findIndex((x) => x.id === qid);
      if (idx < TOTAL_QUESTIONS - 1) setDir(1), setStep(idx + 1);
      else setStep(idx); // stay on last question
    }, 480);
  }

  function toggleMulti(qid: number, value: string, exclusive?: string) {
    setAnswers((a) => {
      const prev = Array.isArray(a[qid]) ? (a[qid] as string[]) : [];
      if (value === exclusive) {
        const wasSelected = prev.length === 1 && prev[0] === value;
        return { ...a, [qid]: wasSelected ? [] : [value] };
      }
      const withoutExclusive = prev.filter((v) => v !== exclusive);
      const next = withoutExclusive.includes(value)
        ? withoutExclusive.filter((v) => v !== value)
        : [...withoutExclusive, value];
      return { ...a, [qid]: next };
    });
  }

  function handleNext() {
    if (!answered || isLast) {
      if (isLast && (answered || q.optional)) onFinish(answers);
      return;
    }
    go(step + 1, 1);
  }

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent) {
    const tag = (e.target as HTMLElement).tagName;
    const inTextarea = tag === "TEXTAREA" || tag === "INPUT";
    if (e.key === "ArrowRight" && !inTextarea) {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft" && !inTextarea) {
      e.preventDefault();
      go(step - 1, -1);
    } else if (!inTextarea && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const buttons = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"], [role="checkbox"]'),
      );
      if (!buttons.length) return;
      e.preventDefault();
      const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const nextIdx = e.key === "ArrowDown" ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
      buttons[idx === -1 ? 0 : nextIdx]?.focus();
    }
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col" onKeyDown={onKeyDown}>
      {/* ambient botanicals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="hero-vignette absolute inset-0" />
        <QuestionAccent index={step + 1} className="anim-sway absolute -right-6 top-24 h-40 w-40 text-gold/10 sm:h-56 sm:w-56" />
        <QuestionAccent index={step + 3} className="absolute -left-8 bottom-16 h-32 w-32 -scale-x-100 text-sage/8 sm:h-44 sm:w-44" />
      </div>

      {/* progress header */}
      <header className="relative z-10 px-5 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <button
            onClick={step === 0 ? onExit : () => go(step - 1, -1)}
            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-sage transition-colors hover:bg-white/8 hover:text-ivory"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? "Home" : "Back"}
          </button>

          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sage/80">
            <span>
              Q<span className="text-gold">{String(step + 1).padStart(2, "0")}</span>
              <span className="mx-1 text-sage/40">/</span>
              {TOTAL_QUESTIONS}
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="hidden sm:block">{pct}%</span>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl">
          <div
            className="shimmer-bar h-1.5 overflow-hidden rounded-full bg-white/8"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Question ${step + 1} of ${TOTAL_QUESTIONS}`}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald via-emerald-bright to-gold"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </header>

      {/* question body */}
      <main className="relative z-10 flex flex-1 items-center px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-2xl"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                {/* animated question number */}
                <div className="mb-3 flex items-baseline gap-1 overflow-hidden" aria-hidden="true">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={step}
                      className="inline-block font-display text-6xl font-semibold italic leading-none text-gold/85 sm:text-7xl"
                      initial={{ y: "70%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-70%", opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {String(step + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                  <span className="font-display text-xl italic text-sage/40">/ 15</span>
                </div>

                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-[1.55rem] font-medium leading-[1.22] text-ivory outline-none sm:text-4xl"
                >
                  {q.title}
                </h2>
                {q.helper && (
                  <p className="mt-3 text-sm leading-relaxed text-sage/80">{q.helper}</p>
                )}
                {q.type === "multi" && (
                  <p className="mt-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold/90">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                    Multiple selections allowed
                  </p>
                )}
                {q.type === "text" && (
                  <p className="mt-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold/90">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                    Optional
                  </p>
                )}
              </div>
            </div>

            {/* answers */}
            <div className="mt-8">
              {q.type === "text" ? (
                <TextAreaQuestion
                  value={(current as string) ?? ""}
                  maxLength={q.maxLength ?? 300}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                />
              ) : (
                <div
                  role={q.type === "single" ? "radiogroup" : "group"}
                  aria-label={q.title}
                  className="flex flex-col gap-3"
                >
                  {q.options.map((o, i) => {
                    const selected =
                      q.type === "single" ? current === o.value : Array.isArray(current) && current.includes(o.value);
                    return (
                      <motion.div
                        key={o.value}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <OptionCard
                          option={o}
                          index={i}
                          mode={q.type === "single" ? "radio" : "check"}
                          selected={selected}
                          onSelect={() => {
                            if (q.type === "single") selectSingle(q.id, o.value);
                            else toggleMulti(q.id, o.value, q.exclusiveOption);
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* footer nav */}
      <footer className="relative z-10 px-5 pb-8 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <button
            onClick={() => go(step - 1, -1)}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-sage transition-colors hover:bg-white/8 hover:text-ivory disabled:pointer-events-none disabled:opacity-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Previous
          </button>

          <RippleButton
            onClick={handleNext}
            disabled={!answered}
            variant={isLast ? "gold" : answered ? "gold" : "ghost"}
            className="min-w-[9.5rem]"
            ariaLabel={isLast ? "Review your answers" : "Next question"}
          >
            {isLast ? (
              <>
                Review answers
                <ClipboardList className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </RippleButton>
        </div>
        <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-sage/40">
          Tip: use arrow keys to navigate
        </p>
      </footer>
    </div>
  );
}

/* ---------------- Q15 text area ---------------- */

function TextAreaQuestion({
  value,
  maxLength,
  onChange,
}: {
  value: string;
  maxLength: number;
  onChange: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
    >
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          maxLength={maxLength}
          rows={5}
          placeholder="Share your thoughts — e.g. short-form reels, campus workshops, credible influencers…"
          className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-[15px] leading-relaxed text-ivory placeholder:text-sage/40 backdrop-blur-md transition-colors duration-300 focus:border-gold/60 focus:shadow-[0_0_28px_-6px_rgba(199,164,93,0.4)] focus:outline-none sm:text-base"
        />
        <span
          className={`absolute bottom-4 right-4 text-[11px] font-semibold tabular-nums ${
            value.length >= maxLength ? "text-gold" : "text-sage/50"
          }`}
          aria-live="polite"
        >
          {value.length} / {maxLength}
        </span>
      </div>
    </motion.div>
  );
}
