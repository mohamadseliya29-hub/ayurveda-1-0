import { useCallback, useState } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  Lock, BarChart3, Users, Leaf, TrendingUp, Download, FileSpreadsheet,
  LogOut, RefreshCw, Eye, FileQuestion,
} from "lucide-react";
import { fetchResponses, type SurveyRow } from "../../lib/supabase";
import { computeStats, distribution, multiDistribution, OPTION_MAP } from "../../lib/results";
import { exportCsv, exportExcel } from "../../lib/export";
import { Mandala } from "../visuals/Botanicals";

const PIE_COLORS = ["#167A55", "#C7A45D", "#B8CDB7", "#1F9E6F", "#E3C886", "#4d7c6a"];
const BAR_COLOR = "#167A55";

const tooltipStyle = {
  backgroundColor: "#0B1F1A",
  border: "1px solid rgba(199,164,93,0.35)",
  borderRadius: "12px",
  fontFamily: "Manrope, sans-serif",
  fontSize: "12px",
  color: "#F7F3E9",
};

export function Dashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<SurveyRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explorerQ, setExplorerQ] = useState(1);

  const load = useCallback(async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchResponses(pwd);
      setRows(data);
      setAuthed(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load responses.";
      setError(msg);
      if (/Incorrect admin password/i.test(msg)) setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- Password gate ---------------- */
  if (!authed) {
    return (
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
        <Mandala className="anim-spin-slow pointer-events-none absolute -right-40 -top-40 h-[70vmin] w-[70vmin] text-gold/5" />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong relative w-full max-w-md rounded-[1.75rem] p-8 sm:p-10"
        >
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-ivory">Admin Dashboard</h1>
          <p className="mt-2 text-sm leading-relaxed text-sage">
            Restricted area. Enter the admin password set in{" "}
            <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-gold">supabase/schema.sql</code>.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(password);
            }}
            className="mt-7"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3.5 text-ivory placeholder:text-sage/40 transition-colors focus:border-gold/60 focus:outline-none"
            />
            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: loading || !password ? 1 : 1.02 }}
              whileTap={{ scale: loading || !password ? 1 : 0.97 }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-bright via-gold to-[#a9863f] py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-forest-deep transition-opacity disabled:opacity-40"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              {loading ? "Verifying…" : "Unlock results"}
            </motion.button>
          </form>
          {error && (
            <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-gold-bright" role="alert">
              {error}
            </p>
          )}
          <p className="mt-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-sage/40">
            <Eye className="h-3 w-3" /> Participants never see this page
          </p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- Dashboard ---------------- */
  const rowsData = rows ?? [];
  const stats = computeStats(rowsData);
  const relevance = distribution(rowsData, 5);
  const practices = multiDistribution(rowsData, 6)
    .filter((d) => d.label !== "None of these")
    .sort((a, b) => b.count - a.count);
  const challenges = distribution(rowsData, 11).sort((a, b) => b.count - a.count);
  const explorerData =
    explorerQ === 6 ? multiDistribution(rowsData, 6) : distribution(rowsData, explorerQ);

  const statCards = [
    { icon: Users, label: "Total Responses", value: String(stats.total), sub: `${stats.last24h} in the last 24h`, color: "text-emerald-bright" },
    { icon: Leaf, label: "Awareness", value: `${stats.awarenessPct.toFixed(1)}%`, sub: "have heard of Ayurveda", color: "text-gold-bright" },
    { icon: TrendingUp, label: "Ever Used Remedies", value: `${stats.usagePct.toFixed(1)}%`, sub: "Q3 — anything but “Never”", color: "text-emerald-bright" },
    { icon: BarChart3, label: "Sees Modern Relevance", value: `${stats.relevancePct.toFixed(1)}%`, sub: "answered Yes or Maybe (Q5)", color: "text-gold-bright" },
  ];

  return (
    <div className="relative min-h-[100svh] px-5 py-10 sm:px-8">
      <div className="hero-vignette absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow-line mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
              Admin · Live Results
            </p>
            <h1 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
              Response Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => void load(password)}
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage transition-colors hover:border-emerald-bright/50 hover:text-ivory"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              onClick={() => exportCsv(rowsData)}
              disabled={!rowsData.length}
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage transition-colors hover:border-gold/50 hover:text-ivory disabled:opacity-35"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            <button
              onClick={() => exportExcel(rowsData)}
              disabled={!rowsData.length}
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage transition-colors hover:border-gold/50 hover:text-ivory disabled:opacity-35"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>
            <button
              onClick={() => { setAuthed(false); setPassword(""); }}
              className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage transition-colors hover:border-red-400/50 hover:text-red-200"
            >
              <LogOut className="h-3.5 w-3.5" /> Lock
            </button>
          </div>
        </div>

        {rowsData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-10 rounded-3xl p-12 text-center"
          >
            <FileQuestion className="mx-auto h-10 w-10 text-sage/40" />
            <p className="mt-4 font-display text-2xl text-ivory">No responses yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sage/80">
              Share the survey link — responses will appear here in real time. Press Refresh after new submissions.
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* stat cards */}
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="glass rounded-3xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-4xl font-semibold text-ivory">{s.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-sage/70">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-sage/55">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* charts */}
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <motion.section
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="glass rounded-3xl p-6"
              >
                <h2 className="font-display text-xl text-ivory">Is Ayurveda relevant in modern times? <span className="text-sm italic text-sage/60">(Q5)</span></h2>
                <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
                  <ResponsiveContainer width="100%" height={230} className="max-w-[240px]">
                    <PieChart>
                      <Pie
                        data={relevance}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        strokeWidth={0}
                        animationDuration={900}
                      >
                        {relevance.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="flex-1 space-y-2.5">
                    {relevance.map((d, i) => (
                      <li key={d.label} className="flex items-center gap-2.5 text-sm text-ivory/85">
                        <span className="h-3 w-3 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {d.label}
                        <span className="ml-auto text-xs font-semibold text-sage/70">
                          {d.count} · {d.pct.toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="glass rounded-3xl p-6"
              >
                <h2 className="font-display text-xl text-ivory">Most popular practices <span className="text-sm italic text-sage/60">(Q6, multi-select)</span></h2>
                <div className="mt-5 h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={practices} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" tick={{ fill: "#B8CDB7", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={120}
                        tick={{ fill: "#F7F3E9", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar
                        dataKey="count"
                        radius={[0, 8, 8, 0]}
                        fill={BAR_COLOR}
                        animationDuration={1000}
                        barSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.29 }}
                className="glass rounded-3xl p-6"
              >
                <h2 className="font-display text-xl text-ivory">Biggest challenges among youth <span className="text-sm italic text-sage/60">(Q11)</span></h2>
                <div className="mt-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={challenges} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" tick={{ fill: "#B8CDB7", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={170}
                        tick={{ fill: "#F7F3E9", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar
                        dataKey="count"
                        radius={[0, 8, 8, 0]}
                        fill="#C7A45D"
                        animationDuration={1000}
                        animationBegin={300}
                        barSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* question explorer */}
              <motion.section
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.36 }}
                className="glass rounded-3xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl text-ivory">Response distribution</h2>
                  <label className="flex items-center gap-2 text-xs text-sage">
                    <span className="font-bold uppercase tracking-[0.16em]">Question</span>
                    <select
                      value={explorerQ}
                      onChange={(e) => setExplorerQ(Number(e.target.value))}
                      className="rounded-lg border border-white/12 bg-forest px-3 py-2 text-ivory focus:border-gold/60 focus:outline-none"
                    >
                      {Object.keys(OPTION_MAP).map((n) => (
                        <option key={n} value={n}>Q{n}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={explorerData} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" allowDecimals={false} tick={{ fill: "#B8CDB7", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={185}
                        tick={{ fill: "#F7F3E9", fontSize: 10.5 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#1F9E6F" animationDuration={800} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>
            </div>

            {/* recent submissions */}
            <motion.section
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="glass mt-6 overflow-hidden rounded-3xl"
            >
              <h2 className="px-6 pt-6 font-display text-xl text-ivory">Recent submissions</h2>
              <div className="mt-4 max-h-80 overflow-auto px-3 pb-4">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-[#0b1f1a] text-[10px] font-bold uppercase tracking-[0.16em] text-sage/60">
                    <tr>
                      <th className="px-3 py-2.5">Time</th>
                      <th className="px-3 py-2.5">Q1 Heard?</th>
                      <th className="px-3 py-2.5">Q3 Used?</th>
                      <th className="px-3 py-2.5">Q5 Relevant?</th>
                      <th className="hidden px-3 py-2.5 sm:table-cell">Q12 Would adopt?</th>
                    </tr>
                  </thead>
                  <tbody className="text-ivory/85">
                    {[...rowsData]
                      .reverse()
                      .slice(0, 60)
                      .map((r) => (
                        <tr key={r.id} className="border-t border-white/6">
                          <td className="whitespace-nowrap px-3 py-2.5 text-sage">
                            {new Date(r.created_at).toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5">{r.q1 ?? "—"}</td>
                          <td className="px-3 py-2.5">{r.q3 ?? "—"}</td>
                          <td className="px-3 py-2.5">{r.q5 ?? "—"}</td>
                          <td className="hidden px-3 py-2.5 sm:table-cell">{r.q12 ?? "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <p className="mt-6 flex items-center justify-center gap-2 pb-6 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-sage/40">
              <Eye className="h-3 w-3" />
              Individual responses are never shown publicly — only aggregates are reported
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
