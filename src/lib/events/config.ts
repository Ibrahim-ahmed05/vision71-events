import type { SheetsConfig } from "./types";

export const DEFAULT_SHEETS_CONFIG: SheetsConfig = {
  spreadsheetId: "1RoNMO_FRPMcSC470E3yCz1-C1wpT6la-JVZLuOz0jag",
  tradeShowsSheet: "Trade Shows",
  techEventsSheet: "Tech Events",
};

const STORAGE_KEY = "vision71.sheets.config";

export function extractSpreadsheetId(input: string): string {
  const match = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.exec(input.trim());
  return match ? match[1] : input.trim();
}

export function readSheetsConfig(): SheetsConfig {
  if (typeof window === "undefined") return DEFAULT_SHEETS_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SHEETS_CONFIG;
    const parsed = JSON.parse(raw) as Partial<SheetsConfig>;
    return {
      spreadsheetId: parsed.spreadsheetId?.trim() || DEFAULT_SHEETS_CONFIG.spreadsheetId,
      tradeShowsSheet: parsed.tradeShowsSheet?.trim() || DEFAULT_SHEETS_CONFIG.tradeShowsSheet,
      techEventsSheet: parsed.techEventsSheet?.trim() || DEFAULT_SHEETS_CONFIG.techEventsSheet,
    };
  } catch {
    return DEFAULT_SHEETS_CONFIG;
  }
}

export function writeSheetsConfig(config: SheetsConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function spreadsheetUrl(id: string): string {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}
