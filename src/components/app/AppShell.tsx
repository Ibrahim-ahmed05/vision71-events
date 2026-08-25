import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  Cpu,
  LayoutGrid,
  Link2,
  Settings,
  Store,
  Bell,
  Search,
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
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center gap-5 px-5 sm:px-8 lg:px-10">
          <Brand />
          <div className="hidden h-6 w-px bg-border xl:block" />
          <nav className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => (
              <TopNavLink key={item.to} item={item} active={isActive(pathname, item.to)} />
          ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button aria-label="Search" className="hidden size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition hover:text-foreground sm:flex"><Search className="size-4" /></button>
            <button aria-label="Notifications" className="hidden size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition hover:text-foreground sm:flex"><Bell className="size-4" /></button>
            <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">V71</div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-5 pb-2 sm:px-8 lg:hidden">
          {NAV.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
                <item.icon className="size-3.5" />
                {item.label}
            </Link>
          );
        })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1480px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-11">
        {children}
      </main>
    </div>
  );
}

function isActive(pathname: string, to: string): boolean {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

function TopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.to}
      className={cn(
        "group flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-200",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:bg-card hover:text-foreground",
      )}
    >
      <item.icon className={cn("size-3.5 transition-colors", active ? "text-primary" : "text-subtle")} />
      {item.label}
    </Link>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3 rounded-xl">
      <img src="/vision71-logo.png" alt="Vision71 Technologies" className="h-auto w-[124px] mix-blend-multiply sm:w-[142px]" />
      <span className="hidden text-[9px] font-semibold uppercase leading-tight tracking-[0.15em] text-subtle 2xl:block">Event<br />intelligence</span>
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
    <header className="relative mb-8 overflow-hidden rounded-[28px] border border-border bg-card px-6 py-8 shadow-card sm:flex sm:items-end sm:justify-between sm:gap-8 sm:px-9 sm:py-10">
      <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Vision71 / Intelligence</p>
        <h1 className="text-balance-tight text-3xl font-semibold tracking-[-0.04em] sm:text-[44px] sm:leading-[1.02]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="relative mt-5 shrink-0 sm:mt-0">{right}</div> : null}
    </header>
  );
}
