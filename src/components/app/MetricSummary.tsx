import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: number | string;
  hint?: string;
}

export function MetricSummary({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className="group relative animate-rise overflow-hidden rounded-2xl border border-border bg-card px-5 py-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            {metric.label}
          </p>
          <p className={cn("mt-3 text-[32px] font-semibold leading-none tracking-[-0.05em]")}>
            {metric.value}
          </p>
          {metric.hint ? <p className="mt-2 text-[11px] text-muted-foreground">{metric.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
