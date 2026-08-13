import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";
import { SyncStatus } from "@/components/app/SyncStatus";
import { ErrorState } from "@/components/app/States";
import { useEventsData } from "@/lib/events/useEvents";
import { countBy, computeMetrics, assessDataQuality, estimatedCostPkr } from "@/lib/events/derive";
import { eventStatus } from "@/lib/events/date";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});

function Analytics() {
  const { data, isError, refresh, events, today } = useEventsData();

  const metrics = computeMetrics(events, today);
  const quality = assessDataQuality(events);

  // Data for charts
  const typeDistribution = [
    { name: "Trade Shows", value: metrics.tradeShows, fill: "var(--color-primary)" },
    { name: "Tech Events", value: metrics.techEvents, fill: "var(--color-chart-2)" },
  ];

  const relevanceDistribution = countBy(events, (e) => e.relevance).map((item, idx) => ({
    name: item.label,
    value: item.value,
    fill: ["var(--color-critical)", "var(--color-warning)", "var(--color-subtle)"][idx] || "var(--color-muted)",
  }));

  const cityDistribution = countBy(events, (e) => e.city)
    .slice(0, 8)
    .map((item) => ({
      name: item.label,
      events: item.value,
    }));

  const statusDistribution = [
    { name: "Upcoming", value: metrics.upcoming },
    { name: "Ended", value: metrics.ended },
  ];

  const costData = events
    .filter((e) => estimatedCostPkr(e) !== null)
    .sort((a, b) => (estimatedCostPkr(b) ?? 0) - (estimatedCostPkr(a) ?? 0))
    .slice(0, 10)
    .map((e) => ({
      name: e.name.slice(0, 20),
      cost: (estimatedCostPkr(e) ?? 0) / 1000,
    }));

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Insights and trends across all events in your dashboard."
        right={data && <SyncStatus fetchedAt={data.fetchedAt} onRefresh={refresh} />}
      />

      {isError && <ErrorState onRetry={refresh} />}

      {!isError && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="px-5 py-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">Total Events</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{events.length}</p>
            </Card>
            <Card className="px-5 py-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">Upcoming</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{metrics.upcoming}</p>
            </Card>
            <Card className="px-5 py-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">High Relevance</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{metrics.highRelevance}</p>
            </Card>
            <Card className="px-5 py-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">Data Quality</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{quality.completeness}%</p>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Event Type Distribution */}
            <Card className="px-6 py-6">
              <h3 className="mb-6 font-semibold">Event Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Relevance Distribution */}
            <Card className="px-6 py-6">
              <h3 className="mb-6 font-semibold">Relevance Assessment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={relevanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Top Cities */}
            <Card className="px-6 py-6">
              <h3 className="mb-6 font-semibold">Events by City</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={cityDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    stroke="var(--color-muted-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="events" fill="var(--color-chart-2)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Event Status */}
            <Card className="px-6 py-6">
              <h3 className="mb-6 font-semibold">Event Status</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { fill: "var(--color-primary)" },
                      { fill: "var(--color-subtle)" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Events by Cost */}
          {costData.length > 0 && (
            <Card className="px-6 py-6">
              <h3 className="mb-6 font-semibold">Top 10 Events by Estimated Cost</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" angle={-45} height={80} />
                  <YAxis stroke="var(--color-muted-foreground)" label={{ value: "PKR (thousands)", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => `PKR ${value}k`} />
                  <Bar dataKey="cost" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Data Quality */}
          <Card className="px-6 py-6">
            <h3 className="mb-4 font-semibold">Data Quality Report</h3>
            <div className="space-y-3">
              {quality.issues.length > 0 ? (
                quality.issues.map((issue) => (
                  <div key={issue.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{issue.label}</span>
                    <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                      {issue.count} events
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">All data quality checks passed!</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
