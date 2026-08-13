import { useMemo, useState } from "react";
import type { NormalizedEvent } from "@/lib/events/types";
import {
  filterEvents,
  sortEvents,
  type EventFilters,
  type SortKey,
  uniqueValues,
} from "@/lib/events/derive";
import { EventCard } from "./EventCard";
import { EventFilters as EventFiltersUI } from "./EventFilters";
import { EmptyState, LoadingSkeleton } from "@/components/app/States";

interface EventGridProps {
  events: NormalizedEvent[];
  isLoading?: boolean;
  today: string;
  onEventClick?: (event: NormalizedEvent) => void;
  initialFilters?: EventFilters;
  showFilters?: boolean;
}

export function EventGrid({
  events,
  isLoading = false,
  today,
  onEventClick,
  initialFilters,
  showFilters = true,
}: EventGridProps) {
  const [filters, setFilters] = useState<EventFilters>(
    initialFilters || {
      query: "",
      type: "all",
      dateRange: "all",
      city: "all",
      sector: "all",
      organizer: "all",
      relevance: "all",
    }
  );
  const [sort, setSort] = useState<SortKey>("soonest");

  // Extract unique values for filter dropdowns
  const cities = useMemo(() => uniqueValues(events, (e) => e.city), [events]);
  const sectors = useMemo(() => uniqueValues(events, (e) => e.category), [events]);
  const organizers = useMemo(() => uniqueValues(events, (e) => e.organizer), [events]);

  // Filter and sort
  const filtered = useMemo(
    () => filterEvents(events, filters, today),
    [events, filters, today]
  );

  const sorted = useMemo(
    () => sortEvents(filtered, sort, today),
    [filtered, sort, today]
  );

  if (isLoading) {
    return <LoadingSkeleton count={6} />;
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <EventFiltersUI
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          cities={cities}
          sectors={sectors}
          organizers={organizers}
          resultCount={sorted.length}
        />
      )}

      {sorted.length === 0 ? (
        <EmptyState
          title="No events found"
          description={
            events.length === 0
              ? "No events in your spreadsheet yet."
              : "Try adjusting your filters or search terms."
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {sorted.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventClick?.(event)}
              today={today}
            />
          ))}
        </div>
      )}
    </div>
  );
}
