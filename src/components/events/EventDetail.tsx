import { X, ExternalLink, Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";
import type { NormalizedEvent } from "@/lib/events/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  RelevanceIndicator,
  StatusPill,
  SourceBadge,
  Field,
  SectionTitle,
  Placeholder,
} from "./EventPrimitives";
import { eventStatus } from "@/lib/events/date";
import { estimatedCostPkr } from "@/lib/events/derive";
import { toast } from "sonner";

interface EventDetailProps {
  event: NormalizedEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  today: string;
}

export function EventDetail({ event, open, onOpenChange, today }: EventDetailProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview"])
  );

  if (!event) return null;

  const status = eventStatus(event, today);
  const costPkr = estimatedCostPkr(event);
  const toggleSection = (section: string) => {
    const next = new Set(expandedSections);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    setExpandedSections(next);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-card shadow-panel transition-transform duration-300",
          "border-l border-border",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-6 py-4 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                {event.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{event.city}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 px-6 py-6 sm:px-8">
          {/* Quick Stats */}
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status={status} />
              <RelevanceIndicator relevance={event.relevance} />
              <SourceBadge source={event.source} />
            </div>
          </section>

          <Separator />

          {/* Overview Section */}
          <section>
            <button
              onClick={() => toggleSection("overview")}
              className="group mb-4 flex w-full items-center justify-between text-left"
            >
              <SectionTitle>Overview</SectionTitle>
              <svg
                className={cn(
                  "size-4 text-subtle transition-transform duration-200",
                  expandedSections.has("overview") ? "rotate-180" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            {expandedSections.has("overview") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  {event.dateRaw}
                  {event.start && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {event.end
                        ? `${event.start} to ${event.end}`
                        : `Start: ${event.start}`}
                    </p>
                  )}
                </Field>
                <Field label="Category">{event.category || <Placeholder>Not specified</Placeholder>}</Field>
                <Field label="Venue">{event.venue || <Placeholder>Not specified</Placeholder>}</Field>
                <Field label="Est. Cost">
                  {costPkr ? `PKR ${(costPkr / 1000).toFixed(0)}k` : <Placeholder>TBA</Placeholder>}
                </Field>
              </div>
            )}
          </section>

          <Separator />

          {/* Organizer & Contact */}
          <section>
            <button
              onClick={() => toggleSection("contact")}
              className="group mb-4 flex w-full items-center justify-between text-left"
            >
              <SectionTitle>Organizer & Contact</SectionTitle>
              <svg
                className={cn(
                  "size-4 text-subtle transition-transform duration-200",
                  expandedSections.has("contact") ? "rotate-180" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            {expandedSections.has("contact") && (
              <div className="space-y-4">
                <Field label="Organizer">{event.organizer || <Placeholder>Not specified</Placeholder>}</Field>
                <Field label="Contact Person">
                  {event.organizerContact || <Placeholder>Not specified</Placeholder>}
                </Field>

                {/* Emails */}
                {event.emails.length > 0 && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                      Emails
                    </dt>
                    <dd className="mt-2 space-y-1">
                      {event.emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]"
                        >
                          <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Mail className="size-3.5" />
                            {email}
                          </a>
                          <button
                            onClick={() => copyToClipboard(email, "Email")}
                            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}

                {/* Phones */}
                {event.phones.length > 0 && (
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">
                      Phone Numbers
                    </dt>
                    <dd className="mt-2 space-y-1">
                      {event.phones.map((phone) => (
                        <div
                          key={phone}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px]"
                        >
                          <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Phone className="size-3.5" />
                            {phone}
                          </a>
                          <button
                            onClick={() => copyToClipboard(phone, "Phone")}
                            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Event Details */}
          <section>
            <button
              onClick={() => toggleSection("details")}
              className="group mb-4 flex w-full items-center justify-between text-left"
            >
              <SectionTitle>Event Details</SectionTitle>
              <svg
                className={cn(
                  "size-4 text-subtle transition-transform duration-200",
                  expandedSections.has("details") ? "rotate-180" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            {expandedSections.has("details") && (
              <div className="space-y-4">
                {event.website && (
                  <Field label="Website">
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      Official website
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Field>
                )}
                {event.scale && (
                  <Field label="Scale">{event.scale}</Field>
                )}
                {event.stallPrice && (
                  <Field label="Stall Price">{event.stallPrice}</Field>
                )}
                {event.stallCost && (
                  <Field label="Stall Cost">{event.stallCost}</Field>
                )}
                {event.discountPackage && (
                  <Field label="Discount Package">{event.discountPackage}</Field>
                )}
                {event.collateralCost && (
                  <Field label="Collateral Cost">{event.collateralCost}</Field>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Research & Strategy */}
          <section>
            <button
              onClick={() => toggleSection("strategy")}
              className="group mb-4 flex w-full items-center justify-between text-left"
            >
              <SectionTitle>Research & Strategy</SectionTitle>
              <svg
                className={cn(
                  "size-4 text-subtle transition-transform duration-200",
                  expandedSections.has("strategy") ? "rotate-180" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            {expandedSections.has("strategy") && (
              <div className="space-y-4">
                {event.relevanceText && (
                  <Field label="Relevance Assessment">
                    {event.relevanceText}
                  </Field>
                )}
                {event.roiEvidence && (
                  <Field label="ROI Evidence">
                    {event.roiEvidence}
                  </Field>
                )}
                {event.linkedinResearch && (
                  <Field label="LinkedIn Research">
                    {event.linkedinResearch}
                  </Field>
                )}
                {event.notes && (
                  <Field label="Notes">
                    {event.notes}
                  </Field>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* Sources */}
          {event.sources.length > 0 && (
            <section>
              <button
                onClick={() => toggleSection("sources")}
                className="group mb-4 flex w-full items-center justify-between text-left"
              >
                <SectionTitle hint={`${event.sources.length}`}>Sources</SectionTitle>
                <svg
                  className={cn(
                    "size-4 text-subtle transition-transform duration-200",
                    expandedSections.has("sources") ? "rotate-180" : ""
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {expandedSections.has("sources") && (
                <div className="space-y-2">
                  {event.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-[12px] transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <ExternalLink className="size-3.5 text-subtle group-hover/link:text-primary" />
                      <span className="truncate text-primary group-hover/link:underline">{source}</span>
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Footer with actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {event.website && (
              <Button
                size="sm"
                asChild
              >
                <a href={event.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                  Visit event
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
