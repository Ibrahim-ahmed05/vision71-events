import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "./events.functions";
import { DEFAULT_SHEETS_CONFIG, readSheetsConfig } from "./config";
import { todayIso } from "./date";
import type { EventsPayload, SheetsConfig } from "./types";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useSheetsConfig(): SheetsConfig {
  const [config, setConfig] = useState<SheetsConfig>(DEFAULT_SHEETS_CONFIG);
  useEffect(() => {
    setConfig(readSheetsConfig());
  }, []);
  return config;
}

export function useEventsData() {
  const config = useSheetsConfig();
  const queryClient = useQueryClient();

  const query = useQuery<EventsPayload>({
    queryKey: ["events", config],
    queryFn: () => fetchEvents({ data: config }),
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES * 3,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["events"] });
  }, [queryClient]);

  return {
    ...query,
    config,
    refresh,
    events: query.data?.events ?? [],
    today: todayIso(),
  };
}
