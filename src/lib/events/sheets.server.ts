import { normalizeSheet } from "./normalize";
import type { EventsPayload, NormalizedEvent, SheetsConfig } from "./types";

function csvUrl(spreadsheetId: string, sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
    spreadsheetId,
  )}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

async function loadSheet(
  spreadsheetId: string,
  sheetName: string,
  source: "trade-show" | "tech-event",
): Promise<{ events: NormalizedEvent[]; ok: boolean; error?: string }> {
  try {
    const res = await fetch(csvUrl(spreadsheetId, sheetName), {
      headers: { Accept: "text/csv" },
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets fetch failed [${res.status}] for "${sheetName}": ${body.slice(0, 300)}`);
      return { events: [], ok: false, error: `HTTP ${res.status}` };
    }
    const text = await res.text();
    if (text.trim().startsWith("<")) {
      console.error(`Sheets returned HTML for "${sheetName}" — likely not publicly shared.`);
      return { events: [], ok: false, error: "Sheet is not publicly readable" };
    }
    return { events: normalizeSheet(text, source), ok: true };
  } catch (error) {
    console.error(`Sheets fetch threw for "${sheetName}":`, error);
    return { events: [], ok: false, error: "Network error" };
  }
}

export async function loadEvents(config: SheetsConfig): Promise<EventsPayload> {
  const [trade, tech] = await Promise.all([
    loadSheet(config.spreadsheetId, config.tradeShowsSheet, "trade-show"),
    loadSheet(config.spreadsheetId, config.techEventsSheet, "tech-event"),
  ]);

  if (!trade.ok && !tech.ok) {
    throw new Error("SHEETS_UNAVAILABLE");
  }

  return {
    events: [...trade.events, ...tech.events],
    fetchedAt: new Date().toISOString(),
    sheetStatus: {
      tradeShows: { ok: trade.ok, rows: trade.events.length, error: trade.error },
      techEvents: { ok: tech.ok, rows: tech.events.length, error: tech.error },
    },
  };
}
