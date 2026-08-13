import { parseCsv } from "./csv";
import { parseEventDate } from "./date";
import type { EventSourceType, NormalizedEvent, Relevance } from "./types";

const clean = (v: string | undefined): string =>
  (v ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

const norm = (v: string): string => v.toLowerCase().replace(/[^a-z0-9]/g, "");

interface ColumnSpec {
  key: string;
  /** normalized header fragments to look for */
  match: string[];
  /** fallback column index when the header row is malformed */
  index: number;
}

const TRADE_COLUMNS: ColumnSpec[] = [
  { key: "srNo", match: ["srno"], index: 0 },
  { key: "name", match: ["tradeshowname", "eventname", "name"], index: 1 },
  { key: "category", match: ["sector", "industry"], index: 2 },
  { key: "date", match: ["date"], index: 3 },
  { key: "city", match: ["city"], index: 4 },
  { key: "venue", match: ["venue"], index: 5 },
  { key: "organizer", match: ["organizercontact"], index: 6 },
  { key: "organizerContact", match: ["organizercontact"], index: 7 },
  { key: "website", match: ["officialwebsite", "website"], index: 8 },
  { key: "stallPrice", match: ["stallprice"], index: 9 },
  { key: "scale", match: ["scale"], index: 10 },
  { key: "sources", match: ["sourcelink"], index: 11 },
  { key: "notes", match: ["notes"], index: 12 },
];

const TECH_COLUMNS: ColumnSpec[] = [
  { key: "srNo", match: ["srno"], index: 0 },
  { key: "name", match: ["eventname", "name"], index: 1 },
  { key: "date", match: ["date"], index: 2 },
  { key: "city", match: ["city"], index: 3 },
  { key: "venue", match: ["venue"], index: 4 },
  { key: "organizer", match: ["organizer"], index: 5 },
  { key: "organizerContact", match: ["organizercontact"], index: 6 },
  { key: "stallCost", match: ["eststallcost", "stallcost"], index: 7 },
  { key: "discountPackage", match: ["discount", "package"], index: 8 },
  { key: "collateralCost", match: ["collateralcost", "collateral"], index: 9 },
  { key: "roiEvidence", match: ["conversion", "roievidence"], index: 10 },
  { key: "linkedinResearch", match: ["linkedin", "sourceresearch"], index: 11 },
  { key: "relevance", match: ["relevancetovision", "relevance"], index: 12 },
  { key: "sources", match: ["sourcelink"], index: 13 },
];

const HEADER_LABELS = [
  "srno",
  "tradeshowname",
  "eventname",
  "sector",
  "date",
  "city",
  "venue",
  "organizer",
];

function looksLikeHeader(row: string[]): boolean {
  const hits = row.filter((cell) => {
    const n = norm(cell);
    return HEADER_LABELS.some((label) => n.startsWith(label));
  });
  return hits.length >= 3;
}

function resolveColumns(header: string[] | null, specs: ColumnSpec[]): Record<string, number> {
  const map: Record<string, number> = {};
  const used = new Set<number>();

  for (const spec of specs) {
    let found = -1;
    if (header) {
      for (let i = 0; i < header.length; i++) {
        if (used.has(i)) continue;
        const n = norm(header[i] ?? "");
        if (!n) continue;
        if (spec.match.some((m) => n.startsWith(m))) {
          found = i;
          break;
        }
      }
    }
    if (found === -1) found = spec.index;
    used.add(found);
    map[spec.key] = found;
  }
  return map;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?92|0)[\d\s()-]{7,16}\d|\+\d[\d\s()-]{7,16}\d/g;

export function extractEmails(text: string): string[] {
  return unique(text.match(EMAIL_RE) ?? []);
}

export function extractPhones(text: string): string[] {
  return unique((text.match(PHONE_RE) ?? []).map((p) => p.trim()).filter((p) => p.length >= 9));
}

const URL_RE = /(https?:\/\/[^\s;,|]+|(?:www\.|[a-z0-9-]+\.)[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s;,|]*)?)/gi;

export function extractUrls(text: string): string[] {
  if (!text) return [];
  const found = text.match(URL_RE) ?? [];
  return unique(
    found
      .map((u) => u.replace(/[.,)]+$/, "").trim())
      .filter((u) => !u.includes("@") && u.includes("."))
      .map((u) => (u.startsWith("http") ? u : `https://${u}`)),
  );
}

export function safeUrl(raw: string): string | null {
  if (!raw) return null;
  const candidate = raw.trim().startsWith("http") ? raw.trim() : `https://${raw.trim()}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function prettyUrl(raw: string): string {
  const safe = safeUrl(raw);
  if (!safe) return raw;
  try {
    const url = new URL(safe);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}`.slice(0, 48);
  } catch {
    return raw;
  }
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((i) => i.trim()).filter(Boolean)));
}

export function parseRelevance(text: string): Relevance {
  const n = text.toLowerCase();
  if (!n.trim()) return "unknown";
  if (/\bhigh\b/.test(n)) return "high";
  if (/\bmedium\b|\bmoderate\b/.test(n)) return "medium";
  if (/\blow\b|\bn\/a\b|not aligned/.test(n)) return "low";
  return "unknown";
}

export function normalizeSheet(csv: string, source: EventSourceType): NormalizedEvent[] {
  const rows = parseCsv(csv);
  if (rows.length === 0) return [];

  const specs = source === "trade-show" ? TRADE_COLUMNS : TECH_COLUMNS;
  const headerIndex = rows.findIndex((r) => looksLikeHeader(r));
  const header = headerIndex >= 0 ? (rows[headerIndex] ?? null) : null;
  const cols = resolveColumns(header, specs);
  const body = rows.slice(headerIndex >= 0 ? headerIndex + 1 : 0);

  const events: NormalizedEvent[] = [];

  body.forEach((row, i) => {
    const get = (key: string): string => clean(row[cols[key] ?? -1]);
    const name = get("name");
    if (!name || name.length < 3) return;
    // Skip legend / helper rows that carry no real event payload.
    if (!get("date") && !get("city") && !get("venue")) return;

    const raw: Record<string, string> = {};
    row.forEach((cell, idx) => {
      const label = clean(header?.[idx]) || `Column ${idx + 1}`;
      const value = clean(cell);
      if (value) raw[label] = value;
    });

    const dateRaw = get("date");
    const { start, end } = parseEventDate(dateRaw);
    const contact = get("organizerContact");
    const relevanceText = get("relevance");
    const websiteField = get("website");
    const sourcesField = get("sources");

    events.push({
      id: `${source}-${get("srNo") || i + 1}-${norm(name).slice(0, 24)}`,
      srNo: get("srNo"),
      name,
      source,
      category: get("category") || (source === "tech-event" ? "Technology" : ""),
      dateRaw,
      start,
      end,
      city: get("city"),
      venue: get("venue"),
      organizer: get("organizer"),
      organizerContact: contact,
      emails: extractEmails(contact),
      phones: extractPhones(contact),
      website: extractUrls(websiteField)[0] ?? "",
      sources: unique([...extractUrls(sourcesField), ...extractUrls(get("linkedinResearch"))]),
      notes: get("notes"),
      stallPrice: get("stallPrice"),
      scale: get("scale"),
      stallCost: get("stallCost"),
      discountPackage: get("discountPackage"),
      collateralCost: get("collateralCost"),
      roiEvidence: get("roiEvidence"),
      linkedinResearch: get("linkedinResearch"),
      relevanceText,
      relevance: parseRelevance(relevanceText),
      raw,
    });
  });

  return events;
}
