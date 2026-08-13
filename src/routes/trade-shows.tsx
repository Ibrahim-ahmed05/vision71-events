import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { MetricSummary } from "@/components/app/MetricSummary";
import { SyncStatus } from "@/components/app/SyncStatus";
import { ErrorState } from "@/components/app/States";
import { EventGrid } from "@/components/events/EventGrid";
import { EventDetail } from "@/components/events/EventDetail";
import { useEventsData } from "@/lib/events/useEvents";
import { computeMetrics } from "@/lib/events/derive";
import type { NormalizedEvent } from "@/lib/events/types";

export const Route = createFileRoute("/trade-shows")({
  component: TradeShows,
});

function TradeShows() {
  const { data, isLoading, isError, error, refresh, events, today } = useEventsData();
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filter to only trade shows
  const tradeShowsOnly = events.filter((e) => e.source === "trade-show");
  const metrics = computeMetrics(tradeShowsOnly, today);

  const handleEventClick = (event: NormalizedEvent) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Trade Shows"
        subtitle="B2B exhibitions and trade shows where you can establish booth presence and network with industry participants."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && <ErrorState onRetry={refresh} />}

      {!isError && (
        <div className="space-y-8">
          {/* Metrics */}
          <MetricSummary
            metrics={[
              { label: "Upcoming", value: metrics.upcoming },
              { label: "This Month", value: metrics.thisMonth },
              { label: "Total", value: metrics.tradeShows },
              { label: "High Relevance", value: metrics.highRelevance },
              { label: "Cities", value: metrics.cities },
              { label: "Ended", value: metrics.ended },
            ]}
          />

          {/* Grid */}
          <EventGrid
            events={tradeShowsOnly}
            isLoading={isLoading}
            today={today}
            onEventClick={handleEventClick}
            initialFilters={{ query: "", type: "trade-show", dateRange: "all", city: "all", sector: "all", organizer: "all", relevance: "all" }}
            showFilters
          />
        </div>
      )}

      {/* Detail Drawer */}
      <EventDetail
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        today={today}
      />
    </>
  );
}
