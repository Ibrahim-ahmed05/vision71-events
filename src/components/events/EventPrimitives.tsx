import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EventStatus, NormalizedEvent, Relevance } from "@/lib/events/types";

const RELEVANCE_LABEL: Record<Relevance, string> = {
  high: "High relevance",
  medium: "Medium relevance",
  low: "Low relevance",
  unknown: "Relevance unrated",
};

export function RelevanceIndicator({
  relevance,
  className,
}: {
  relevance: Relevance;
  className?: string;
}) {
  if (relevance === "unknown") return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", className)}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          relevance === "high" && "bg-critical",
          relevance === "medium" && "bg-warning",
          relevance === "low" && "bg-subtle",
        )}
      />
      <span
        className={cn(
          relevance === "high" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {RELEVANCE_LABEL[relevance]}
      </span>
    </span>
  );
}

const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  today: "Today",
  ongoing: "Ongoing",
  ended: "Ended",
  undated: "Date TBA",
};

export function StatusPill({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em]",
        status === "ended" ? "text-subtle" : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full",
          status === "upcoming" && "bg-primary",
          status === "today" && "bg-success",
          status === "ongoing" && "bg-success",
          status === "ended" && "bg-subtle",
          status === "undated" && "bg-warning",
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SourceBadge({ source }: { source: NormalizedEvent["source"] }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-subtle">
      {source === "trade-show" ? "Trade Show" : "Tech Event"}
    </span>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">{label}</dt>
      <dd className="mt-1 text-[13px] leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[15px] font-semibold tracking-tight">{children}</h2>
      {hint ? <span className="text-[11px] text-subtle">{hint}</span> : null}
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-[13px] italic text-subtle">{children}</span>;
}
