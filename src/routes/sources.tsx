import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { SyncStatus } from "@/components/app/SyncStatus";
import { ErrorState } from "@/components/app/States";
import { useEventsData } from "@/lib/events/useEvents";
import { countBy } from "@/lib/events/derive";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/sources")({
  component: Sources,
});

function Sources() {
  const { data, isError, refresh, events, today } = useEventsData();

  const sourceCount = countBy(events, (e) =>
    e.sources.length > 0 ? new URL(e.sources[0]).hostname : "Unknown"
  );

  const organizerCount = countBy(events, (e) => e.organizer);
  const cityCount = countBy(events, (e) => e.city);

  return (
    <>
      <PageHeader
        title="Sources"
        subtitle="Overview of event organizers, geographic distribution, and primary information sources."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && <ErrorState onRetry={refresh} />}

      {!isError && (
        <div className="space-y-8">
          {/* Top Organizers */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Top Organizers</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {organizerCount.slice(0, 12).map((item) => (
                <Card
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value} events</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">{item.value}</span>
                </Card>
              ))}
            </div>
          </section>

          {/* Geographic Distribution */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Geographic Distribution</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {cityCount.map((item) => (
                <Card
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value} events</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">{item.value}</span>
                </Card>
              ))}
            </div>
          </section>

          {/* Information Sources */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Information Sources</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sourceCount.slice(0, 12).map((item) => (
                <a
                  key={item.label}
                  href={`https://${item.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary hover:shadow-lift"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.value} references</p>
                  </div>
                  <ExternalLink className="ml-2 size-4 flex-shrink-0 text-subtle group-hover:text-primary" />
                </a>
              ))}
            </div>
          </section>

          {/* Data Summary */}
          <section className="rounded-xl border border-border bg-accent/20 px-6 py-6">
            <h3 className="mb-4 text-sm font-semibold">Data Summary</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">
                  Total Events
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{events.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">
                  Unique Cities
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{cityCount.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">
                  Unique Organizers
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{organizerCount.length}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
