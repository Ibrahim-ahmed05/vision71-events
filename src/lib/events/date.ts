import type { EventStatus, NormalizedEvent } from "./types";

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const MONTH_RE = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");

const M = (k?: string): number => MONTHS[(k ?? "").toLowerCase()] ?? 0;
const N = (v?: string): number => Number(v ?? 0);

function iso(y: number, m: number, d: number): string {
  const max = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const day = Math.min(Math.max(d, 1), max);
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Parses the free-form date strings maintained in the spreadsheet.
 * Handles: "22-24 Sept 2026", "31 July - 2 August", "10-12 Sept 2026 (13th edition)",
 * "4 Nov 2026", "TBA", and gracefully returns nulls for anything unrecognisable.
 */
export function parseEventDate(input: string | undefined | null): {
  start: string | null;
  end: string | null;
} {
  if (!input) return { start: null, end: null };

  // Drop parenthetical annotations and take the first date expression only.
  let s = String(input)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (!s || /^(tba|tbd|n\/?a|-)$/i.test(s)) return { start: null, end: null };

  const yearMatch = s.match(/\b(20\d{2})\b/);
  const fallbackYear = yearMatch ? N(yearMatch[1]) : null;

  // Pattern A: "31 July - 2 August 2026" | "31 July - 2 August"
  const a = new RegExp(
    `\\b(\\d{1,2})\\s*(${MONTH_RE})\\.?\\s*-\\s*(\\d{1,2})\\s*(${MONTH_RE})\\.?\\s*(20\\d{2})?`,
    "i",
  ).exec(s);
  if (a) {
    const y = a[5] ? N(a[5]) : inferYear(M(a[2]), N(a[1]), fallbackYear);
    const y2 = M(a[4]) < M(a[2]) ? y + 1 : y;
    return {
      start: iso(y, M(a[2]), N(a[1])),
      end: iso(y2, M(a[4]), N(a[3])),
    };
  }

  // Pattern B: "22-24 Sept 2026" | "22 - 24 September"
  const b = new RegExp(`\\b(\\d{1,2})\\s*-\\s*(\\d{1,2})\\s*(${MONTH_RE})\\.?\\s*(20\\d{2})?`, "i").exec(s);
  if (b) {
    const m = M(b[3]);
    const y = b[4] ? N(b[4]) : inferYear(m, N(b[1]), fallbackYear);
    return { start: iso(y, m, N(b[1])), end: iso(y, m, N(b[2])) };
  }

  // Pattern C: "Sept 22-24, 2026"
  const c = new RegExp(`\\b(${MONTH_RE})\\.?\\s*(\\d{1,2})\\s*-\\s*(\\d{1,2}),?\\s*(20\\d{2})?`, "i").exec(s);
  if (c) {
    const m = M(c[1]);
    const y = c[4] ? N(c[4]) : inferYear(m, N(c[2]), fallbackYear);
    return { start: iso(y, m, N(c[2])), end: iso(y, m, N(c[3])) };
  }

  // Pattern D: single day "28 July 2026" / "July 28, 2026"
  const d1 = new RegExp(`\\b(\\d{1,2})\\s*(${MONTH_RE})\\.?\\s*(20\\d{2})?`, "i").exec(s);
  if (d1) {
    const m = M(d1[2]);
    const y = d1[3] ? N(d1[3]) : inferYear(m, N(d1[1]), fallbackYear);
    const v = iso(y, m, N(d1[1]));
    return { start: v, end: v };
  }
  const d2 = new RegExp(`\\b(${MONTH_RE})\\.?\\s*(\\d{1,2}),?\\s*(20\\d{2})?`, "i").exec(s);
  if (d2) {
    const m = M(d2[1]);
    const y = d2[3] ? N(d2[3]) : inferYear(m, N(d2[2]), fallbackYear);
    const v = iso(y, m, N(d2[2]));
    return { start: v, end: v };
  }

  // Pattern E: ISO or numeric
  const e = /\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/.exec(s);
  if (e) {
    const v = iso(N(e[1]), N(e[2]) - 1, N(e[3]));
    return { start: v, end: v };
  }

  return { start: null, end: null };
}

function inferYear(month: number, day: number, fallback: number | null): number {
  if (fallback) return fallback;
  const now = new Date();
  const y = now.getUTCFullYear();
  const candidate = Date.UTC(y, month, day);
  return candidate < Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) ? y + 1 : y;
}

export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

export function eventStatus(event: NormalizedEvent, today: string): EventStatus {
  if (!event.start) return "undated";
  const end = event.end ?? event.start;
  if (event.start === today || end === today) return "today";
  if (event.start < today && end > today) return "ongoing";
  if (end < today) return "ended";
  return "upcoming";
}

const FMT_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const mon = (m: number): string => FMT_MONTH[m - 1] ?? "";

export function formatRange(start: string | null, end: string | null, fallback: string): string {
  if (!start) return fallback?.trim() || "Date to be announced";
  const sp = start.split("-").map(Number);
  const sy = sp[0] ?? 0, sm = sp[1] ?? 1, sd = sp[2] ?? 1;
  if (!end || end === start) return `${sd} ${mon(sm)} ${sy}`;
  const ep = end.split("-").map(Number);
  const ey = ep[0] ?? 0, em = ep[1] ?? 1, ed = ep[2] ?? 1;
  if (sy === ey && sm === em) return `${sd}–${ed} ${mon(sm)} ${sy}`;
  if (sy === ey) return `${sd} ${mon(sm)} – ${ed} ${mon(em)} ${sy}`;
  return `${sd} ${mon(sm)} ${sy} – ${ed} ${mon(em)} ${ey}`;
}

export function daysUntil(startIso: string, today: string): number {
  const a = Date.parse(`${startIso}T00:00:00Z`);
  const b = Date.parse(`${today}T00:00:00Z`);
  return Math.round((a - b) / 86400000);
}
