import { ChevronRight, ExternalLink } from "lucide-react";
import type { NormalizedEvent } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { RelevanceIndicator, StatusPill, SourceBadge } from "./EventPrimitives";
import { estimatedCostPkr } from "@/lib/events/derive";
import { eventStatus } from "@/lib/events/date";

interface EventCardProps {
  event: NormalizedEvent;
  onClick?: () => void;
  today: string;
}

export function EventCard({ event, onClick, today }: EventCardProps) {
  const status = eventStatus(event, today);
  const costPkr = estimatedCostPkr(event);
  const costDisplay = costPkr ? `PKR ${(costPkr / 1000).toFixed(0)}k` : "Price TBA";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group card-surface w-full flex flex-col gap-4 p-5 text-left transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift active:scale-[0.99]",
      )}
    >
      {/* Header: Name + Source */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex-1 text-[15px] font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
          {event.name}
        </h3>
        <div className="flex-shrink-0">
          <SourceBadge source={event.source} />
        </div>
      </div>

      {/* Metadata: Date, City, Venue */}
      <div className="space-y-1">
        <p className="text-[12px] text-muted-foreground line-clamp-1">
          {event.dateRaw}
        </p>
        <span className="block text-[11px] font-medium text-foreground truncate">{event.city}</span>
        {event.venue && (
          <span className="block text-[11px] text-subtle truncate">{event.venue}</span>
        )}
      </div>

      {/* Category + Organizer */}
      <div className="space-y-1 border-y border-border py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-subtle">
          {event.category}
        </p>
        {event.organizer && (
          <p className="text-[11px] text-muted-foreground truncate line-clamp-1">{event.organizer}</p>
        )}
      </div>

      {/* Indicators: Relevance + Status */}
      <div className="flex flex-wrap items-start gap-2">
        <RelevanceIndicator relevance={event.relevance} />
        <StatusPill status={status} />
      </div>

      {/* Cost Badge */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
          Est. Cost
        </div>
        <div className="text-[12px] font-semibold text-foreground">{costDisplay}</div>
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* Footer: Hover State with CTA */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 pt-2 border-t border-border/0 transition-all duration-200",
          "group-hover:border-border",
        )}
      >
        <div className="flex items-center gap-1 min-w-0">
          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80 truncate"
            >
              Website
              <ExternalLink className="size-3 flex-shrink-0" />
            </a>
          )}
        </div>
        <ChevronRight className="size-4 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground flex-shrink-0" />
      </div>
    </button>
  );
}
