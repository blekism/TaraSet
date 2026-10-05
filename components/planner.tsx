"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import {
  CalendarDays,
  Coffee,
  Film,
  Gamepad2,
  ListChecks,
  MapPin,
  Mountain,
  PartyPopper,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { ItineraryShape } from "@/lib/types";
import { formatWindow } from "@/lib/availability";
// import { formatWindow } from "@/lib/availability";

export const ACTIVITIES = [
  { key: "food", label: "Food", icon: UtensilsCrossed },
  { key: "drinks", label: "Drinks", icon: Coffee },
  { key: "movie", label: "Movie", icon: Film },
  { key: "trip", label: "Trip", icon: Mountain },
  { key: "beach", label: "Beach", icon: Waves },
  { key: "party", label: "Party", icon: PartyPopper },
  { key: "gaming", label: "Gaming", icon: Gamepad2 },
  { key: "other", label: "Other", icon: Sparkles },
] as const;

export function activityMeta(key: string) {
  return ACTIVITIES.find((a) => a.key === key) ?? ACTIVITIES[7];
}

interface Props {
  circle_id: string;
  plans: ItineraryShape[];
}

export function PlanPanel({ circle_id, plans }: Props) {
  const [activity, setActivity] = useState<string>("food");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [food, setFood] = useState("");
  const [note, setNote] = useState("");

  const sorted = useMemo(
    () => [...plans].sort((a, b) => a.start_date.localeCompare(b.start_date)),
    [plans],
  );

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Plan the hangout
        </h2>

        <div
          className={cn(
            "mt-3 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
            target
              ? "border-lime/50 bg-lime/10 text-lime"
              : "border-dashed border-border text-muted-foreground",
          )}
        >
          <CalendarDays className="size-4 shrink-0" />
          {target ? (
            <>
              <span className="font-medium">
                {formatWindow(target.start, target.end)}
              </span>
              <button
                type="button"
                onClick={onClearTarget}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                clear
              </button>
            </>
          ) : (
            <span className="text-xs">
              Pick dates on the calendar, or tap a suggested window above.
            </span>
          )}
        </div>

        <p className="mt-4 text-xs font-medium text-muted-foreground">
          What are we doing?
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {ACTIVITIES.map((a) => {
            const Icon = a.icon;
            const active = a.key === activity;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => setActivity(a.key)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 text-[10px] transition-colors",
                  active
                    ? "border-lime/60 bg-lime/15 text-lime"
                    : "border-border bg-background text-muted-foreground hover:border-lime/30 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {a.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-2.5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a name — “Sunset hike”"
            maxLength={80}
            className="bg-background"
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where? e.g. Camden, Sarah's place"
            maxLength={120}
            className="bg-background"
          />
          <Input
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Food & drinks? e.g. BBQ, ramen"
            maxLength={120}
            className="bg-background"
          />
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything else — budget, who's driving…"
            maxLength={300}
            rows={2}
            className="resize-none bg-background"
          />
        </div>

        <Button
          className="mt-3 w-full"
          // disabled={!target || save.isPending}
          // onClick={() => save.mutate()}
        >
          Add to the plan
        </Button>

        <Button asChild variant="outline" className="mt-2 w-full gap-2">
          <Link href={`/Circle/Itinerary/${circle_id}`}>
            <ListChecks className="size-4" /> Add Events to the Plan
          </Link>
        </Button>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Ideas on the table
        </h3>
        {sorted.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
            No ideas yet. Suggest what to do on a date everyone is free.
          </p>
        ) : (
          sorted.map((p) => {
            // const meta = activityMeta(p.activity);
            // const Icon = meta.icon;
            return (
              <article
                key={p.itinerary_id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  {/* <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-lime ring-1 ring-lime/25">
                    <Icon className="size-4" />
                  </span> */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold">
                      {p.name}
                      {/* {p.title || meta.label} */}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatWindow(p.start_date, p.end_date)}
                      {/* } ·{" "}{nameFor(p.user_id)} */}
                    </p>
                  </div>
                  {/* {p.user_id === userId ? ( */}
                  <button
                    type="button"
                    aria-label="Remove idea"
                    // onClick={() => remove.mutate(p.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  {/* ) : null} */}
                </div>

                {p.location ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.location ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
                        <MapPin className="size-3 text-lime" /> {p.location}
                      </span>
                    ) : null}
                    {/* {p.food ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
                        <UtensilsCrossed className="size-3 text-lime" />{" "}
                        {p.food}
                      </span>
                    ) : null} */}
                  </div>
                ) : null}
                {p.notes ? (
                  <p className="mt-2.5 text-xs text-muted-foreground">
                    {p.notes}
                  </p>
                ) : null}
              </article>
            );
          })
        )}
      </section>
    </aside>
  );
}
