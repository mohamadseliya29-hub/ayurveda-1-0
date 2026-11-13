# AYURVEDA 2.0 — Ancient Wisdom. Modern Wellness.

An award-style, fully interactive survey experience for a college **Health & Wellness competition**, built with React + Vite + TypeScript + Tailwind CSS 4 + Motion + Recharts, collecting **real responses in Supabase**.

## ✨ What's inside

| Experience | Details |
|---|---|
| Cinematic loader | ~2.5s golden-glow + botanical intro, then fades into the site |
| Hero | Full-screen parallax hero, floating botanicals, particles, magnetic + ripple CTA |
| Three Doshas | Interactive Vata / Pitta / Kapha cards with custom SVG art (with a clear "not a medical diagnosis" disclaimer) |
| Survey | **One question per screen**, animated transitions, glowing selection states, progress bar + %, auto-advance on single choice, multi-select for Q6, character counter for Q15, keyboard navigation, draft auto-save |
| Privacy | Explicit privacy notice **before** the survey (anonymous, no personal data, one response per device) |
| Review | "Your perspective matters." summary screen with per-question edit |
| Success | Animated golden botanical checkmark, falling petals, particles |
| Admin | `#/admin` password-gated dashboard: live stats, animated charts, per-question explorer, CSV + Excel export |

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open the printed local URL. The experience works fully — but submissions need Supabase configured (next section). Until then, submitting shows a clear configuration message instead of pretending to save.

## 🗄️ Real data collection — Supabase setup (~5 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql), **edit the admin password** in the marked line (`'change-me-now'`), then click **Run**. This creates:
   - `ayurveda_responses` — insert-only for anonymous users (Row Level Security: **no SELECT policy**, so individual responses are never publicly exposed)
   - `ayurveda_admin_config` — the admin password (locked down by RLS)
   - `ayurveda_get_results(p_password)` — a `SECURITY DEFINER` RPC that only returns rows when the correct admin password is supplied
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.
4. Create `.env.local` in the project root:

   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```

5. Restart `npm run dev` (or rebuild) — submissions now persist with a timestamp.

### How duplicates are prevented
- A random anonymous `token` is generated per browser (`localStorage`) and has a **UNIQUE constraint** in Postgres.
- A local "submitted" flag blocks accidental double submits from the same device.
- The review screen acts as an explicit confirmation step.

### Privacy model
- No name, email, phone or ID is collected — only answers + submission timestamp.
- Anonymous visitors can **insert** but never **select** (RLS).
- The admin dashboard reads rows **only** through the password-guarded RPC.

## 🔐 Admin dashboard

Open `https://your-site/#/admin` (the footer has a discreet "Admin" link). Enter the password you set in `schema.sql` to see:

- Total responses + responses in the last 24h
- **Awareness %** (Q1), **Usage %** (Q3), **Modern relevance %** (Q5)
- Most popular Ayurvedic practices (Q6), biggest challenges (Q11)
- Per-question response distribution explorer (Q1–Q14)
- Recent submissions table
- **Export CSV** and **Export Excel** (opens directly in Excel)

The dashboard is code-split — regular participants never download it, and the route is behind the password gate.

## 📦 Deployment (Vercel / Netlify)

```bash
npm run build   # outputs dist/
```

Deploy `dist/` (or connect the repo). Add the two `VITE_…` environment variables in the hosting dashboard. Hash-based routing means **no rewrite rules are needed** — the link works anywhere you drop the folder, including GitHub Pages.

## ✅ Quality checklist (verified)

- `tsc --noEmit` passes with zero errors; production build succeeds
- All 15 questions validated (single, multi, text), Back/Next + arrow-key navigation
- Duplicate submissions blocked (client flag + DB unique constraint)
- Submissions persist to Supabase with timestamps; errors surface honestly if unconfigured
- Export CSV/Excel generates real files from live data
- Responsive from 320px phones (WhatsApp primary audience) to desktop; no horizontal scrolling; large touch targets
- `prefers-reduced-motion` respected; keyboard accessible; focus moves to each new question

## 🧰 Tech stack

React 19 · Vite · TypeScript · Tailwind CSS 4 · Motion (Framer Motion for React) · Lucide icons · Recharts · Supabase
