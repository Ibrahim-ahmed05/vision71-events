import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { loadEvents } from "./sheets.server";

const configSchema = z.object({
  spreadsheetId: z.string().min(10).max(200),
  tradeShowsSheet: z.string().min(1).max(120),
  techEventsSheet: z.string().min(1).max(120),
});

export const fetchEvents = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => configSchema.parse(data))
  .handler(async ({ data }) => loadEvents(data));
