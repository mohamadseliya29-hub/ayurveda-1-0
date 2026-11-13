import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sprout, X, Loader2 } from "lucide-react";
import { CursorGlow } from "./components/ui/CursorGlow";
import { Loader } from "./components/Loader";
import { Hero } from "./components/sections/Hero";
import { Doshas } from "./components/sections/Doshas";
import { PrivacyNotice } from "./components/survey/PrivacyNotice";
import { SurveyFlow } from "./components/survey/SurveyFlow";
import { ReviewScreen } from "./components/survey/ReviewScreen";
import { SuccessScreen } from "./components/survey/SuccessScreen";
import { Leaf } from "./components/visuals/Botanicals";
import { submitSurvey, type AnswerMap } from "./lib/supabase";
import { hasSubmitted, clearDraft } from "./lib/storage";

/** Admin dashboard (Recharts) is code-split so participants never download it. */
const Dashboard = lazy(() =>
  import("./components/admin/Dashboard").then((m) => ({ default: m.Dashboard })),
);

type Phase = "loading" | "home" | "survey" | "review" | "success";

function useHashRoute() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith("#/admin"));
  useEffect(() => {
    const onChange = () => setIsAdmin(window.location.hash.startsWith("#/admin"));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return isAdmin;
}

export default function App() {
  const isAdmin = useHashRoute();
  const [phase, setPhase] = useState<Phase>("loading");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAlready, setShowAlready] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [startStep, setStartStep] = useState(0);

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const startSurvey = useCallback(() => {
    setShowPrivacy(false);
    if (hasSubmitted()) {
      setShowAlready(true);
      return;
    }
    setStartStep(0);
    setPhase("survey");
  }, []);

  const handleSubmit = useCallback(async (finalAnswers: AnswerMap) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitSurvey(finalAnswers);
      if (result.ok) {
        setAnswers(finalAnswers);
        clearDraft();
        setPhase("success");
      } else {
        setSubmitError(
          result.duplicate
            ? "A response from this device has already been recorded — thank you for participating!"
            : result.message ?? "Something went wrong. Please try again.",
        );
      }
    } catch (e) {
      setSubmitError(
        e instanceof Error ? `Network error: ${e.message}` : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (isAdmin) {
    return (
      <main className="bg-forest min-h-[100svh]">
        <Suspense
          fallback={
            <div className="flex min-h-[100svh] items-center justify-center text-sage">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
        >
          <Dashboard />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] overflow-x-clip bg-forest text-ivory">
      <CursorGlow />

      <AnimatePresence>{phase === "loading" && <Loader onDone={() => setPhase("home")} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {phase !== "loading" && (
          <motion.div
            key={phase === "home" ? "home" : phase === "success" ? "success" : "survey-shell"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {phase === "home" && (
              <>
                <Hero onStart={() => setShowPrivacy(true)} />
                <Doshas />
                <Footer />
              </>
            )}

            {(phase === "survey" || phase === "review") && (
              <AnimatePresence mode="wait">
                {phase === "survey" ? (
                  <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SurveyFlow
                      key={startStep}
                      initialStep={startStep}
                      onFinish={(a) => {
                        setAnswers(a);
                        setPhase("review");
                      }}
                      onExit={() => setPhase("home")}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ReviewScreen
                      answers={answers}
                      submitting={submitting}
                      error={submitError}
                      onEdit={(i) => {
                        setStartStep(i);
                        setSubmitError(null);
                        setPhase("survey");
                      }}
                      onSubmit={() => void handleSubmit(answers)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {phase === "success" && <SuccessScreen onHome={() => setPhase("home")} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* privacy modal */}
      <AnimatePresence>
        {showPrivacy && (
          <PrivacyNotice onClose={() => setShowPrivacy(false)} onBegin={startSurvey} />
        )}
      </AnimatePresence>

      {/* already-responded modal */}
      <AnimatePresence>
        {showAlready && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            aria-modal="true"
          >
            <motion.div
              className="glass-strong relative w-full max-w-sm rounded-[1.5rem] p-8 text-center"
              initial={{ y: 40, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
            >
              <button
                onClick={() => setShowAlready(false)}
                aria-label="Close"
                className="absolute right-3 top-3 rounded-full p-2 text-sage/70 hover:bg-white/10 hover:text-ivory"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald/20 text-emerald-bright">
                <Sprout className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-ivory">You&apos;ve already responded</h2>
              <p className="mt-3 text-sm leading-relaxed text-sage">
                One response per device keeps the results honest — thank you for being part of the change!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-forest-deep px-6 py-12 text-center">
      <Leaf className="mx-auto mb-4 h-8 w-8 text-gold/50" />
      <p className="font-display text-lg italic text-ivory/90">Ancient Wisdom. Modern Wellness.</p>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.3em] text-sage/50">
        Ayurveda 2.0 · A College Health &amp; Wellness Initiative
      </p>
      <a
        href="#/admin"
        className="mt-5 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-sage/25 transition-colors hover:text-gold/60"
      >
        Admin
      </a>
    </footer>
  );
}
