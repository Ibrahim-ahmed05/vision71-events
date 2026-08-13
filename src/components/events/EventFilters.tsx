import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFilters, SortKey } from "@/lib/events/derive";

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  cities: string[];
  sectors: string[];
  organizers: string[];
  resultCount: number;
}

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "soonest", label: "Soonest first" },
  { value: "newest", label: "Newest first" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "relevance", label: "Highest relevance" },
  { value: "cost-asc", label: "Cheapest first" },
  { value: "cost-desc", label: "Most expensive" },
  { value: "recent-order", label: "Recently added" },
];

export function EventFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  cities,
  sectors,
  organizers,
  resultCount,
}: EventFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const hasActiveFilters =
    filters.query ||
    filters.type !== "all" ||
    filters.dateRange !== "all" ||
    filters.city !== "all" ||
    filters.sector !== "all" ||
    filters.organizer !== "all" ||
    filters.relevance !== "all";

  const handleReset = () => {
    onFiltersChange({
      query: "",
      type: "all",
      dateRange: "all",
      city: "all",
      sector: "all",
      organizer: "all",
      relevance: "all",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search + Sort Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            placeholder="Search events, cities, organizers..."
            value={filters.query}
            onChange={(e) =>
              onFiltersChange({ ...filters, query: e.target.value })
            }
            className="pl-10"
          />
        </div>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Collapsible Filter Panel */}
      <div className={cn("overflow-hidden transition-all duration-200", expanded ? "h-auto" : "h-0")}>
        <div className="space-y-3 border-t border-border pt-4">
          {/* Type + Date Range */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                Event Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(type: any) =>
                  onFiltersChange({ ...filters, type })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  <SelectItem value="trade-show">Trade Shows</SelectItem>
                  <SelectItem value="tech-event">Tech Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                Date Range
              </label>
              <Select
                value={filters.dateRange}
                onValueChange={(dateRange: any) =>
                  onFiltersChange({ ...filters, dateRange })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="quarter">Next 90 days</SelectItem>
                  <SelectItem value="past">Past events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* City + Sector */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                City
              </label>
              <Select
                value={filters.city}
                onValueChange={(city) =>
                  onFiltersChange({ ...filters, city })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                Sector
              </label>
              <Select
                value={filters.sector}
                onValueChange={(sector) =>
                  onFiltersChange({ ...filters, sector })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organizer + Relevance */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                Organizer
              </label>
              <Select
                value={filters.organizer}
                onValueChange={(organizer) =>
                  onFiltersChange({ ...filters, organizer })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All organizers</SelectItem>
                  {organizers.slice(0, 20).map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                Relevance
              </label>
              <Select
                value={filters.relevance}
                onValueChange={(relevance: any) =>
                  onFiltersChange({ ...filters, relevance })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All relevance</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-primary"
        >
          {expanded ? "Hide" : "Show"} filters
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-subtle hover:text-foreground"
            >
              <X className="size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
