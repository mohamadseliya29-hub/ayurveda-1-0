import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getParticipantToken, markSubmitted } from "./storage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The survey writes real submissions to Supabase. Until the two environment
 * variables are provided (.env.local — see README.md), `supabase` is null and
 * the app shows a clear configuration notice instead of pretending to work.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = supabase !== null;

export type AnswerMap = Record<number, string | string[]>;

export interface SubmitResult {
  ok: boolean;
  duplicate?: boolean;
  message?: string;
}

function flattenAnswers(answers: AnswerMap, token: string) {
  const row: Record<string, string | null> = {};
  for (let q = 1; q <= 15; q++) {
    const a = answers[q];
    row[`q${q}`] =
      a === undefined ? null : Array.isArray(a) ? (a.length ? a.join(", ") : null) : a.trim() || null;
  }
  return { ...row, token };
}

/**
 * Inserts one response. Duplicates are prevented on three levels:
 *  1. localStorage flag + stable per-browser token (checked before sending)
 *  2. a UNIQUE constraint on the token in Postgres
 *  3. the review screen acts as an explicit confirmation step
 */
export async function submitSurvey(answers: AnswerMap): Promise<SubmitResult> {
  if (!supabase) {
    return {
      ok: false,
      message:
        "The database is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local (see README.md), then rebuild.",
    };
  }

  const token = getParticipantToken();
  const payload = flattenAnswers(answers, token);

  const { error } = await supabase.from("ayurveda_responses").insert(payload);

  if (!error) {
    markSubmitted(token);
    return { ok: true };
  }

  if (error.code === "23505") {
    markSubmitted(token);
    return { ok: false, duplicate: true, message: "A response from this device already exists." };
  }
  if (error.code === "42P01" || error.code === "PGRST202" || error.code === "42501") {
    return {
      ok: false,
      message: "Database not initialised. Run supabase/schema.sql in the Supabase SQL editor first.",
    };
  }

  return { ok: false, message: `Submission failed: ${error.message}` };
}

/* ---------------- Admin dashboard data access ---------------- */

export interface SurveyRow {
  id: string;
  token: string;
  created_at: string;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  q6: string | null;
  q7: string | null;
  q8: string | null;
  q9: string | null;
  q10: string | null;
  q11: string | null;
  q12: string | null;
  q13: string | null;
  q14: string | null;
  q15: string | null;
}

/**
 * Rows are only readable through the password-guarded RPC created in
 * supabase/schema.sql — anonymous visitors can insert but never select.
 */
export async function fetchResponses(adminPassword: string): Promise<SurveyRow[]> {
  if (!supabase) throw new Error("Supabase is not configured. Add credentials to .env.local.");

  const { data, error } = await supabase.rpc("ayurveda_get_results", {
    p_password: adminPassword,
  });

  if (error) {
    if (/INVALID_ADMIN_PASSWORD/.test(error.message)) {
      throw new Error("Incorrect admin password.");
    }
    if (error.code === "PGRST202" || error.code === "42P01") {
      throw new Error("Database not initialised. Run supabase/schema.sql in the Supabase SQL editor.");
    }
    if (error.code === "42501" || /permission/i.test(error.message)) {
      throw new Error("Access denied. Grant EXECUTE on the RPC to anon in supabase/schema.sql.");
    }
    throw new Error(error.message);
  }
  return (data ?? []) as SurveyRow[];
}
