import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SyncStatus({
  fetchedAt,
  isFetching = false,
  onRefresh,
  ok = true,
}: {
  fetchedAt?: string | undefined;
  isFetching?: boolean;
  onRefresh: () => void;
  ok?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden items-center gap-2 text-[11px] text-subtle sm:flex">
        <span
          className={cn(
            "size-1.5 rounded-full",
            ok ? "bg-success" : "bg-warning",
            isFetching && "animate-pulse",
          )}
        />
        {fetchedAt ? `Last synced ${formatSync(fetchedAt)}` : "Connecting to spreadsheet"}
      </span>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
        <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
        Refresh
      </Button>
    </div>
  );
}

export function formatSync(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
