import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  Cpu,
  LayoutGrid,
  Link2,
  Settings,
  Store,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  short: string;
}

const NAV: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutGrid, short: "Overview" },
  { to: "/trade-shows", label: "Trade Shows", icon: Store, short: "Trade" },
  { to: "/tech-events", label: "Tech Events", icon: Cpu, short: "Tech" },
  { to: "/calendar", label: "Calendar", icon: CalendarDays, short: "Calendar" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, short: "Analytics" },
  { to: "/sources", label: "Sources", icon: Link2, short: "Sources" },
  { to: "/settings", label: "Settings", icon: Settings, short: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => (
            <SidebarLink key={item.to} item={item} active={isActive(pathname, item.to)} />
          ))}
        </nav>
        <p className="px-3 text-[11px] leading-relaxed text-subtle">
          Vision71 Technologies
          <br />
          Internal intelligence platform
        </p>
      </aside>

      <div className="lg:pl-60">
        <main className="mx-auto w-full max-w-[1400px] px-5 pb-28 pt-8 sm:px-8 lg:pb-16 lg:pt-12">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-1 border-t border-border bg-card/85 px-2 py-2 backdrop-blur-xl lg:hidden">
        {NAV.slice(0, 5).map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-[18px]" />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function isActive(pathname: string, to: string): boolean {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.to}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
      )}
    >
      <item.icon className={cn("size-4 transition-colors", active ? "text-primary" : "text-subtle")} />
      {item.label}
    </Link>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground">
        V7
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold tracking-tight">Event Intelligence</span>
        <span className="block text-[11px] text-subtle">Vision71 Technologies</span>
      </span>
    </Link>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-balance-tight text-3xl font-semibold sm:text-[40px] sm:leading-[1.05]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}
