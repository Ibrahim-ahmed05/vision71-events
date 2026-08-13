import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { SyncStatus } from "@/components/app/SyncStatus";
import { ErrorState } from "@/components/app/States";
import { EventDetail } from "@/components/events/EventDetail";
import { useEventsData } from "@/lib/events/useEvents";
import { eventStatus } from "@/lib/events/date";
import type { NormalizedEvent } from "@/lib/events/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/calendar")({
  component: Calendar,
});

function Calendar() {
  const { data, isError, refresh, events, today } = useEventsData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const handleEventClick = (event: NormalizedEvent) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((e) => e.start === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today":
        return "bg-success text-success";
      case "ongoing":
        return "bg-success text-success";
      case "upcoming":
        return "bg-primary text-primary";
      default:
        return "bg-subtle text-subtle";
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...days,
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Visual timeline of all events. Click any date to see scheduled activities."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && <ErrorState onRetry={refresh} />}

      {!isError && (
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-muted/50 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="px-2 py-3 text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const isCurrentMonth = day !== null;
                const dayEvents = isCurrentMonth ? getEventsForDate(day) : [];
                const isToday =
                  isCurrentMonth &&
                  day.toISOString().split("T")[0] === today;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-24 border-b border-r border-border px-2 py-2",
                      !isCurrentMonth && "bg-muted/20",
                      isToday && "bg-primary/5"
                    )}
                  >
                    {isCurrentMonth && (
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            isToday
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {day.getDate()}
                        </p>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => {
                            const status = eventStatus(event, today);
                            const color = getStatusColor(status);
                            return (
                              <button
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className="block w-full text-left"
                              >
                                <div className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                                  {event.name}
                                </div>
                              </button>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <p className="text-[9px] text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Today / Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-subtle" />
              <span className="text-sm text-muted-foreground">Other</span>
            </div>
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
