import type { SurveyRow } from "./supabase";

export interface Distribution {
  label: string;
  count: number;
  pct: number;
}

export const OPTION_MAP: Record<number, string[]> = {
  1: ["Yes", "No", "A little"],
  2: ["Very familiar", "Somewhat familiar", "Not very familiar", "Not familiar at all"],
  3: ["Frequently", "Occasionally", "Once or twice", "Never"],
  4: [
    "Preventing diseases and maintaining health",
    "Treating health problems",
    "Improving overall wellness",
    "All of the above",
    "Not sure",
  ],
  5: ["Yes", "No", "Maybe"],
  6: ["Yoga", "Meditation", "Ayurvedic diet", "Herbal remedies", "Panchakarma", "None of these"],
  7: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"],
  8: ["Very often", "Sometimes", "Rarely", "Never"],
  9: [
    "Family and relatives",
    "Social media",
    "Internet and websites",
    "Books and educational institutions",
    "Doctors or healthcare professionals",
  ],
  10: ["Yes", "No", "Maybe", "Not sure"],
  11: [
    "Lack of awareness",
    "Lack of scientific understanding",
    "Preference for modern medicine",
    "Misleading information",
    "Lack of accessibility",
  ],
  12: ["Definitely", "Maybe", "Not interested", "Already following them"],
  13: ["Yes", "No", "Maybe"],
  14: [
    "Lack of scientific evidence for some claims",
    "Quality and authenticity",
    "Safety and possible side effects",
    "Lack of proper guidance",
    "No major concerns",
  ],
};

/** Count how many responses selected a given single-choice option for question q. */
export function distribution(rows: SurveyRow[], q: number): Distribution[] {
  const options = OPTION_MAP[q];
  const total = rows.length || 1;
  return options.map((label) => {
    const count = rows.filter((r) => {
      const v = (r as unknown as Record<string, string | null>)[`q${q}`];
      return v === label;
    }).length;
    return { label, count, pct: (count / total) * 100 };
  });
}

/** Multi-select (Q6): each option counts once per response that contains it. */
export function multiDistribution(rows: SurveyRow[], q: number): Distribution[] {
  const options = OPTION_MAP[q];
  const total = rows.length || 1;
  return options.map((label) => {
    const count = rows.filter((r) => {
      const v = (r as unknown as Record<string, string | null>)[`q${q}`];
      return v ? v.split(",").map((s) => s.trim()).includes(label) : false;
    }).length;
    return { label, count, pct: (count / total) * 100 };
  });
}

export function pctOf(rows: SurveyRow[], predicate: (r: SurveyRow) => boolean): number {
  if (!rows.length) return 0;
  return (rows.filter(predicate).length / rows.length) * 100;
}

export interface Stats {
  total: number;
  awarenessPct: number; // heard of Ayurveda (Q1 Yes or A little)
  usagePct: number; // ever used remedies (Q3 anything but Never)
  relevancePct: number; // Q5 Yes or Maybe
  complementPct: number; // Q10 Yes or Maybe
  wouldAdoptPct: number; // Q12 Definitely / Maybe / Already following
  last24h: number;
}

export function computeStats(rows: SurveyRow[]): Stats {
  return {
    total: rows.length,
    awarenessPct: pctOf(rows, (r) => r.q1 === "Yes" || r.q1 === "A little"),
    usagePct: pctOf(rows, (r) => r.q3 !== null && r.q3 !== "Never"),
    relevancePct: pctOf(rows, (r) => r.q5 === "Yes" || r.q5 === "Maybe"),
    complementPct: pctOf(rows, (r) => r.q10 === "Yes" || r.q10 === "Maybe"),
    wouldAdoptPct: pctOf(
      rows,
      (r) => r.q12 === "Definitely" || r.q12 === "Maybe" || r.q12 === "Already following them",
    ),
    last24h: rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 86_400_000).length,
  };
}
