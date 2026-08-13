import { AlertTriangle, RefreshCw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface animate-shimmer p-5" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="h-3 w-20 rounded-full bg-muted" />
          <div className="mt-4 h-4 w-3/4 rounded-full bg-muted" />
          <div className="mt-2 h-4 w-1/2 rounded-full bg-muted" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-2/3 rounded-full bg-muted" />
            <div className="h-3 w-1/2 rounded-full bg-muted" />
          </div>
          <div className="mt-6 h-3 w-24 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-shimmer bg-card p-5">
          <div className="h-3 w-16 rounded-full bg-muted" />
          <div className="mt-4 h-7 w-12 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No events found",
  description = "Try changing your filters or search terms.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <SearchX className="size-5 text-subtle" />
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-20 text-center">
      <AlertTriangle className="size-5 text-warning" />
      <h3 className="mt-4 text-base font-semibold">Unable to sync event data</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Check the spreadsheet connection and try again.
      </p>
      <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>
        <RefreshCw className="size-3.5" />
        Retry sync
      </Button>
    </div>
  );
}
