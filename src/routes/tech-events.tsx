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

export const Route = createFileRoute("/tech-events")({
  component: TechEvents,
});

function TechEvents() {
  const { data, isLoading, isError, error, refresh, events, today } = useEventsData();
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filter to only tech events
  const techEventsOnly = events.filter((e) => e.source === "tech-event");
  const metrics = computeMetrics(techEventsOnly, today);

  const handleEventClick = (event: NormalizedEvent) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Tech Events"
        subtitle="Conferences, seminars, webinars, and technical gatherings focused on technology innovation and digital transformation."
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
              { label: "Total", value: metrics.techEvents },
              { label: "High Relevance", value: metrics.highRelevance },
              { label: "Cities", value: metrics.cities },
              { label: "Ended", value: metrics.ended },
            ]}
          />

          {/* Grid */}
          <EventGrid
            events={techEventsOnly}
            isLoading={isLoading}
            today={today}
            onEventClick={handleEventClick}
            initialFilters={{ query: "", type: "tech-event", dateRange: "all", city: "all", sector: "all", organizer: "all", relevance: "all" }}
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
