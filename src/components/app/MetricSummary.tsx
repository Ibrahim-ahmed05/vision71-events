import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: number | string;
  hint?: string;
}

export function MetricSummary({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className="animate-rise bg-card px-5 py-5 transition-colors duration-300 hover:bg-accent/40"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
            {metric.label}
          </p>
          <p className={cn("mt-2 text-[28px] font-semibold leading-none tracking-tight")}>
            {metric.value}
          </p>
          {metric.hint ? <p className="mt-2 text-[11px] text-muted-foreground">{metric.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
