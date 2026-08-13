import { daysUntil, eventStatus } from "./date";
import type { EventStatus, NormalizedEvent, Relevance } from "./types";

export interface EventFilters {
  query: string;
  type: "all" | "trade-show" | "tech-event";
  dateRange: "all" | "today" | "week" | "month" | "quarter" | "past";
  city: string;
  sector: string;
  organizer: string;
  relevance: "all" | Relevance;
}

export const EMPTY_FILTERS: EventFilters = {
  query: "",
  type: "all",
  dateRange: "all",
  city: "all",
  sector: "all",
  organizer: "all",
  relevance: "all",
};

export type SortKey =
  | "soonest"
  | "newest"
  | "alphabetical"
  | "relevance"
  | "cost-desc"
  | "cost-asc"
  | "recent-order";

const RELEVANCE_RANK: Record<Relevance, number> = { high: 3, medium: 2, low: 1, unknown: 0 };

/** Rough PKR value used only for relative sorting/aggregation of cost fields. */
export function estimatedCostPkr(event: NormalizedEvent): number | null {
  const text = `${event.stallCost} ${event.stallPrice}`;
  if (!text.trim()) return null;
  const usd = /\$\s?([\d,]+(?:\.\d+)?)/.exec(text);
  if (usd?.[1]) return Number(usd[1].replace(/,/g, "")) * 280;
  const pkr = /(?:pkr|rs\.?)\s?([\d,]{4,})/i.exec(text) ?? /\b([\d,]{6,})\b/.exec(text);
  if (pkr?.[1]) return Number(pkr[1].replace(/,/g, ""));
  return null;
}

export function scaleValue(event: NormalizedEvent): number | null {
  const nums = (event.scale.match(/[\d,]{3,}/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

export function searchableText(event: NormalizedEvent): string {
  return [
    event.name,
    event.category,
    event.city,
    event.venue,
    event.organizer,
    event.organizerContact,
    event.notes,
    event.relevanceText,
    event.roiEvidence,
    event.scale,
    event.dateRaw,
    event.sources.join(" "),
    event.website,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterEvents(
  events: NormalizedEvent[],
  filters: EventFilters,
  today: string,
): NormalizedEvent[] {
  const q = filters.query.trim().toLowerCase();
  const terms = q ? q.split(/\s+/) : [];

  return events.filter((event) => {
    if (filters.type !== "all" && event.source !== filters.type) return false;
    if (filters.city !== "all" && event.city !== filters.city) return false;
    if (filters.sector !== "all" && event.category !== filters.sector) return false;
    if (filters.organizer !== "all" && event.organizer !== filters.organizer) return false;
    if (filters.relevance !== "all" && event.relevance !== filters.relevance) return false;

    if (filters.dateRange !== "all") {
      const status = eventStatus(event, today);
      if (filters.dateRange === "past") {
        if (status !== "ended") return false;
      } else {
        if (status === "ended" || status === "undated" || !event.start) return false;
        const days = daysUntil(event.start, today);
        const limit =
          filters.dateRange === "today" ? 0 : filters.dateRange === "week" ? 7 : filters.dateRange === "month" ? 31 : 92;
        if (days > limit) return false;
      }
    }

    if (terms.length > 0) {
      const haystack = searchableText(event);
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

export function sortEvents(events: NormalizedEvent[], key: SortKey, today: string): NormalizedEvent[] {
  const list = [...events];
  const byDateAsc = (a: NormalizedEvent, b: NormalizedEvent) =>
    (a.start ?? "9999").localeCompare(b.start ?? "9999");

  switch (key) {
    case "soonest":
      return list.sort((a, b) => {
        const ae = eventStatus(a, today) === "ended" ? 1 : 0;
        const be = eventStatus(b, today) === "ended" ? 1 : 0;
        if (ae !== be) return ae - be;
        return byDateAsc(a, b);
      });
    case "newest":
      return list.sort((a, b) => (b.start ?? "0000").localeCompare(a.start ?? "0000"));
    case "alphabetical":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "relevance":
      return list.sort(
        (a, b) => RELEVANCE_RANK[b.relevance] - RELEVANCE_RANK[a.relevance] || byDateAsc(a, b),
      );
    case "cost-desc":
      return list.sort((a, b) => (estimatedCostPkr(b) ?? -1) - (estimatedCostPkr(a) ?? -1));
    case "cost-asc":
      return list.sort(
        (a, b) => (estimatedCostPkr(a) ?? Number.MAX_SAFE_INTEGER) - (estimatedCostPkr(b) ?? Number.MAX_SAFE_INTEGER),
      );
    case "recent-order":
      return list.sort((a, b) => Number(b.srNo || 0) - Number(a.srNo || 0));
    default:
      return list;
  }
}

export interface Metrics {
  upcoming: number;
  thisMonth: number;
  tradeShows: number;
  techEvents: number;
  highRelevance: number;
  cities: number;
  ended: number;
}

export function computeMetrics(events: NormalizedEvent[], today: string): Metrics {
  let upcoming = 0;
  let thisMonth = 0;
  let ended = 0;
  const cities = new Set<string>();

  const monthPrefix = today.slice(0, 7);

  for (const event of events) {
    const status = eventStatus(event, today);
    if (status === "upcoming" || status === "today" || status === "ongoing") upcoming++;
    if (status === "ended") ended++;
    if (event.start?.startsWith(monthPrefix) && status !== "ended") thisMonth++;
    if (event.city) cities.add(event.city);
  }

  return {
    upcoming,
    thisMonth,
    tradeShows: events.filter((e) => e.source === "trade-show").length,
    techEvents: events.filter((e) => e.source === "tech-event").length,
    highRelevance: events.filter((e) => e.relevance === "high" && eventStatus(e, today) !== "ended").length,
    cities: cities.size,
    ended,
  };
}

export function countBy(events: NormalizedEvent[], pick: (e: NormalizedEvent) => string): Array<{ label: string; value: number }> {
  const map = new Map<string, number>();
  for (const event of events) {
    const key = pick(event).trim();
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function uniqueValues(events: NormalizedEvent[], pick: (e: NormalizedEvent) => string): string[] {
  return Array.from(new Set(events.map(pick).map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function buildInsights(events: NormalizedEvent[], today: string): string[] {
  const insights: string[] = [];
  const active = events.filter((e) => {
    const s = eventStatus(e, today);
    return s === "upcoming" || s === "today" || s === "ongoing";
  });
  if (active.length === 0) return insights;

  const cities = countBy(active, (e) => e.city);
  if (cities[0] && cities[0].value > 1) {
    insights.push(
      `${cities[0].label} holds the highest concentration of upcoming events (${cities[0].value} of ${active.length}).`,
    );
  }

  const next90 = active.filter((e) => e.start && daysUntil(e.start, today) <= 90);
  const sectors = countBy(next90, (e) => e.category);
  if (sectors[0] && sectors[0].value > 1) {
    insights.push(
      `${sectors[0].label} is the most represented sector over the next 90 days (${sectors[0].value} events).`,
    );
  }

  const high = active.filter((e) => e.relevance === "high").length;
  if (high > 0) {
    insights.push(`${high} upcoming ${high === 1 ? "event has" : "events have"} high relevance to Vision71.`);
  }

  const withRoi = active.filter((e) => e.roiEvidence && !/^n\/?a/i.test(e.roiEvidence)).length;
  if (withRoi > 0) {
    insights.push(`${withRoi} upcoming events carry documented past-edition ROI or conversion evidence.`);
  }

  return insights;
}

export interface DataQuality {
  completeness: number;
  issues: Array<{ label: string; count: number }>;
  duplicates: Array<{ name: string; count: number }>;
}

export function assessDataQuality(events: NormalizedEvent[]): DataQuality {
  if (events.length === 0) return { completeness: 100, issues: [], duplicates: [] };

  const checks: Array<{ label: string; test: (e: NormalizedEvent) => boolean }> = [
    { label: "Missing dates", test: (e) => !e.start },
    { label: "Missing organizer", test: (e) => !e.organizer },
    { label: "Missing official website", test: (e) => !e.website },
    { label: "Missing city", test: (e) => !e.city },
    { label: "Missing venue", test: (e) => !e.venue },
    { label: "Missing source links", test: (e) => e.sources.length === 0 },
  ];

  let missing = 0;
  const issues = checks.map((check) => {
    const count = events.filter(check.test).length;
    missing += count;
    return { label: check.label, count };
  });

  const nameMap = new Map<string, number>();
  for (const e of events) {
    const key = `${e.name.toLowerCase().replace(/[^a-z0-9]/g, "")}|${e.city.toLowerCase()}`;
    nameMap.set(key, (nameMap.get(key) ?? 0) + 1);
  }
  const duplicates = Array.from(nameMap.entries())
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ name: key.split("|")[0] ?? key, count }));

  const total = events.length * checks.length;
  return {
    completeness: Math.round(((total - missing) / total) * 100),
    issues: issues.filter((i) => i.count > 0).sort((a, b) => b.count - a.count),
    duplicates,
  };
}

export function statusOf(event: NormalizedEvent, today: string): EventStatus {
  return eventStatus(event, today);
}
