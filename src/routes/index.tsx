import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { MetricSummary } from "@/components/app/MetricSummary";
import { SyncStatus } from "@/components/app/SyncStatus";
import { ErrorState, EmptyState } from "@/components/app/States";
import { EventGrid } from "@/components/events/EventGrid";
import { EventDetail } from "@/components/events/EventDetail";
import { useEventsData } from "@/lib/events/useEvents";
import { computeMetrics, buildInsights } from "@/lib/events/derive";
import type { NormalizedEvent } from "@/lib/events/types";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Overview,
});

function Overview() {
  const { data, isLoading, isError, error, refresh, events, today } = useEventsData();
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const metrics = computeMetrics(events, today);
  const insights = buildInsights(events, today);

  const handleEventClick = (event: NormalizedEvent) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Event Intelligence"
        subtitle="Real-time visibility across tech events and trade shows in Pakistan. Track opportunities, assess relevance, and plan your participation strategy."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && (
        <ErrorState onRetry={refresh} />
      )}

      {!isError && (
        <div className="space-y-8">
          {/* Metrics */}
          <MetricSummary
            metrics={[
              { label: "Upcoming", value: metrics.upcoming },
              { label: "This Month", value: metrics.thisMonth },
              { label: "Trade Shows", value: metrics.tradeShows },
              { label: "Tech Events", value: metrics.techEvents },
              { label: "High Relevance", value: metrics.highRelevance },
              { label: "Cities", value: metrics.cities },
            ]}
          />

          {/* Insights */}
          {insights.length > 0 && (
            <div className="rounded-xl border border-border bg-accent/20 px-6 py-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Executive Insights</h3>
              <ul className="space-y-2">
                {insights.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <span className="mt-1 inline-block size-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Events Grid */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">All Events</h2>
            <EventGrid
              events={events}
              isLoading={isLoading}
              today={today}
              onEventClick={handleEventClick}
              showFilters
            />
          </div>
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
