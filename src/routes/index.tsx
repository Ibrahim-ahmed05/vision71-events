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
import { ArrowUpRight, Sparkles } from "lucide-react";

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
        subtitle="A focused view of Pakistan's technology and trade landscape—built to help your team spot the right opportunities and move early."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && (
        <ErrorState onRetry={refresh} />
      )}

      {!isError && (
        <div className="space-y-10">
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
            <div className="relative overflow-hidden rounded-2xl border border-border bg-[linear-gradient(120deg,var(--color-card),var(--color-accent))] px-6 py-5 shadow-card sm:px-7">
              <div className="absolute -right-8 -top-12 size-40 rounded-full bg-primary/5 blur-2xl" />
              <div className="relative flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="size-4 text-primary" /> Executive brief</h3>
                <ArrowUpRight className="size-4 text-subtle" />
              </div>
              <ul className="space-y-2">
                {insights.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <span className="mt-1.5 inline-block size-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Events Grid */}
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">Opportunity pipeline</p><h2 className="mt-1 text-xl font-semibold">All events</h2></div>
            </div>
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
