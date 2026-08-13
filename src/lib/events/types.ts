export type EventSourceType = "trade-show" | "tech-event";

export type Relevance = "high" | "medium" | "low" | "unknown";

export type EventStatus = "upcoming" | "today" | "ongoing" | "ended" | "undated";

export interface NormalizedEvent {
  /** Stable id derived from sheet + row */
  id: string;
  srNo: string;
  name: string;
  source: EventSourceType;
  category: string;
  dateRaw: string;
  /** ISO date (yyyy-mm-dd) when parseable */
  start: string | null;
  end: string | null;
  city: string;
  venue: string;
  organizer: string;
  organizerContact: string;
  emails: string[];
  phones: string[];
  website: string;
  sources: string[];
  notes: string;
  /* Trade-show specific */
  stallPrice: string;
  scale: string;
  /* Tech-event specific */
  stallCost: string;
  discountPackage: string;
  collateralCost: string;
  roiEvidence: string;
  linkedinResearch: string;
  relevanceText: string;
  relevance: Relevance;
  /** Every original column preserved */
  raw: Record<string, string>;
}

export interface SheetsConfig {
  spreadsheetId: string;
  tradeShowsSheet: string;
  techEventsSheet: string;
}

export interface EventsPayload {
  events: NormalizedEvent[];
  fetchedAt: string;
  sheetStatus: {
    tradeShows: { ok: boolean; rows: number; error?: string };
    techEvents: { ok: boolean; rows: number; error?: string };
  };
}
