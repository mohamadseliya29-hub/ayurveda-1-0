const TOKEN_KEY = "ayurveda_token";
const SUBMITTED_KEY = "ayurveda_submitted";

/** Stable anonymous token for this browser — used only for de-duplication. */
export function getParticipantToken(): string {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `t_${Date.now()}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function hasSubmitted(): boolean {
  return localStorage.getItem(SUBMITTED_KEY) === getParticipantToken();
}

export function markSubmitted(token: string): void {
  if (token === getParticipantToken()) {
    localStorage.setItem(SUBMITTED_KEY, token);
  }
}

/** Draft persistence so an accidental refresh never loses answers. */
export function saveDraft(answers: Record<number, string | string[]>): void {
  try {
    localStorage.setItem("ayurveda_draft", JSON.stringify(answers));
  } catch {
    /* storage unavailable — non-critical */
  }
}

export function loadDraft(): Record<number, string | string[]> | null {
  try {
    const raw = localStorage.getItem("ayurveda_draft");
    return raw ? (JSON.parse(raw) as Record<number, string | string[]>) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem("ayurveda_draft");
  } catch {
    /* ignore */
  }
}
