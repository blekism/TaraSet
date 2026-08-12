"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  UtensilsCrossed,
  MapPinCheckInside,
} from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { activityMeta } from "@/components/planner";
import { formatWindow } from "@/lib/availability";
import { useSession } from "@/hooks/useSession";

export default function ItineraryClient({ initialData }: { initialData: any }) {
  const { user } = useSession();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const nameFor = (id: string) => {
    const p = initialData?.profiles?.find((x: any) => x.id === id);
    return p?.display_name ?? p?.email ?? "Someone";
  };

  const destinations = useMemo(
    () =>
      [...(initialData?.plans ?? [])].sort((a: any, b: any) =>
        a.start_date.localeCompare(b.start_date),
      ),
    [initialData],
  );

  useEffect(() => {
    if (destinations.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !destinations.some((d) => d.id === selectedId)) {
      setSelectedId(destinations[0]!.id);
    }
  }, [destinations, selectedId]);

  const selected = destinations.find((d: any) => d.id === selectedId);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <section className="min-w-0 space-y-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Destinations
        </h2>
        {destinations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-xs text-muted-foreground">
            Nothing here yet — add your first destination.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {destinations.map((d: any, i: number) => {
              const meta = activityMeta(d.activity);
              const Icon = meta.icon;
              const active = d.id === selectedId;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(d.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-lime/50 bg-lime/10 glow-ring"
                        : "border-border bg-background hover:border-lime/30",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
                        active
                          ? "bg-lime/20 text-lime ring-lime/40"
                          : "bg-surface-2 text-muted-foreground ring-border",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate font-display font-semibold",
                          active && "text-lime",
                        )}
                      >
                        {i + 1}. {d.title || meta.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {formatWindow(d.start_date, d.end_date)}
                      </span>
                      {d.location ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          📍 {d.location}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-surface p-6">
        {!selected ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Select a destination to see its details.
          </p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-lime/15 text-lime ring-1 ring-lime/30">
                  <MapPinCheckInside className="size-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold">{selected.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Added by {nameFor(selected.user_id)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Detail
                icon={<CalendarDays className="size-4" />}
                label="Dates"
                value={formatWindow(selected.start_date, selected.end_date)}
              />
              <Detail
                icon={<Clock className="size-4" />}
                label="Time"
                value={
                  selected.start_time
                    ? `${selected.start_time.slice(0, 5)}${
                        selected.end_time
                          ? ` – ${selected.end_time.slice(0, 5)}`
                          : ""
                      }`
                    : "—"
                }
              />
              <Detail
                icon={<MapPin className="size-4" />}
                label="Location"
                value={selected.location || "—"}
              />
              <Detail
                icon={<UtensilsCrossed className="size-4" />}
                label="Food & drinks"
                value={selected.food || "—"}
              />
            </div>

            {selected.note ? (
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1.5 text-sm">{selected.note}</p>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-xl border border-border bg-background">
              <button
                type="button"
                onClick={() => setMapOpen((v) => !v)}
                aria-expanded={mapOpen}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-surface-2"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-lime" /> View on map
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    mapOpen && "rotate-180",
                  )}
                />
              </button>
              {mapOpen ? (
                selected.location ? (
                  <iframe
                    title={`Map of ${selected.location}`}
                    loading="lazy"
                    className="h-80 w-full border-t border-border"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(selected.location)}&output=embed`}
                  />
                ) : (
                  <p className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
                    No location set for this destination.
                  </p>
                )
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium">{value}</p>
    </div>
  );
}
