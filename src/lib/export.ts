import type { SurveyRow } from "./supabase";

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Neutralise spreadsheet formula injection
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows: SurveyRow[]): string {
  const header = ["submitted_at", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.created_at ? new Date(r.created_at).toISOString() : "",
        r.q1, r.q2, r.q3, r.q4, r.q5, r.q6, r.q7, r.q8, r.q9, r.q10, r.q11, r.q12, r.q13, r.q14, r.q15,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  // UTF-8 BOM so Excel opens Devanagari / accents correctly
  return "\uFEFF" + lines.join("\r\n");
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportCsv(rows: SurveyRow[]): void {
  if (!rows.length) return;
  const blob = new Blob([rowsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  download(blob, "ayurveda-2-0-responses.csv");
}

/** Genuine Excel-openable workbook (Excel 2003 HTML format, .xls). */
export function exportExcel(rows: SurveyRow[]): void {
  if (!rows.length) return;
  const header = ["Submitted at", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15"];
  const esc = (v: unknown) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const thead = `<tr>${header.map((h) => `<th style="background:#102B23;color:#F7F3E9;padding:6px 10px;text-align:left;border:1px solid #999">${esc(h)}</th>`).join("")}</tr>`;
  const tbody = rows
    .map((r) => {
      const cells = [
        r.created_at ? new Date(r.created_at).toLocaleString() : "",
        r.q1, r.q2, r.q3, r.q4, r.q5, r.q6, r.q7, r.q8, r.q9, r.q10, r.q11, r.q12, r.q13, r.q14, r.q15,
      ];
      return `<tr>${cells.map((c) => `<td style="padding:5px 10px;border:1px solid #ccc">${esc(c)}</td>`).join("")}</tr>`;
    })
    .join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><title>Ayurveda 2.0 Responses</title></head><body><table>${thead}${tbody}</table></body></html>`;
  download(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }), "ayurveda-2-0-responses.xls");
}
