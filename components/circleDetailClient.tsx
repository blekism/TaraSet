"use client";

import { useState, useEffect, useMemo } from "react";
import type { Circle, ItineraryShape } from "@/lib/types";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO } from "date-fns";
import { ArrowLeft, Check, Copy, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PlanPanel } from "@/components/planner";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { GetCircle, GetItinerary } from "@/backend/read.controller";
import { computeOverlaps, dayKey, formatWindow } from "@/lib/availability";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/authProvider";

interface Props {
  id: string;
}

export default function CircleDetailClient({ id }: Props) {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [range, setRange] = useState<DateRange | undefined>();
  const [planTarget, setPlanTarget] = useState<
    { start: string; end: string } | undefined
  >();

  const [circle, setCircle] = useState<Circle | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryShape[] | null>(null);
  // const [availableDates, setAvailableDates] = useState();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function data() {
      const [circleData, itineraryData] = await Promise.all([
        GetCircle(id),
        GetItinerary(id),
      ]);

      if (circleData.code !== 1 || itineraryData.code !== 1) {
        setError("Could not complete your request");
        toast.error("Could not complete your request");
      }

      setCircle(circleData.data);
      setItinerary(itineraryData.data);
      setIsLoading(false);
    }

    data();
  }, []);

  const availableDates = circle?.tbl3cdtbl ?? [];
  // const circleMembers = circle?.tbl2cmtbl!;

  const nameFor = (id: string) => {
    const p = (circle?.tbl2cmtbl ?? []).find((x) => x.member_id === id);
    return p?.tbl4utbl.username ?? "Someone";
  };

  const overlaps = useMemo(() => computeOverlaps(availableDates), [circle]);

  const memberCount = circle?.total_members.length ?? 0;
  const best = overlaps.slice(0, 5);

  const mine = availableDates.filter((a) => a.user_id === currentUserId);
  const marked = new Set(availableDates.map((a) => a.user_id));

  console.log("marked size:", marked.size);

  const daysOf = (rows: typeof availableDates) =>
    rows.flatMap((a) =>
      eachDayOfInterval({
        start: parseISO(a.start_date),
        end: parseISO(a.end_date),
      }),
    );
  const myDays = daysOf(mine);
  const groupDays = daysOf(
    availableDates.filter((a) => a.user_id !== currentUserId),
  );

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error || !circle || !itinerary) {
    return <div>error</div>;
  }

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/Circles"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3" /> All circles
            </Link>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(circle?.circle_code ?? "");
                toast.success("Invite code copied");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-lime/40 bg-lime/10 px-4 py-2.5 font-mono text-sm tracking-[0.35em] text-lime transition-colors hover:bg-lime/20"
            >
              {circle?.circle_code}
              <Copy className="size-3.5" />
            </button>
          </div>

          <header className="rounded-2xl border border-border bg-surface p-6">
            <div>
              <h1 className="text-4xl font-bold">{circle?.circle_name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {memberCount} {memberCount === 1 ? "person" : "people"} ·{" "}
                {marked.size} marked their dates
              </p>
            </div>
          </header>

          {/* Best dates */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="size-4 text-lime" /> Best dates to meet
            </h2>
            {availableDates.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing yet — mark your free dates below and nudge the others.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {best.map((w) => {
                  const everyone =
                    w.user_id.length === memberCount && memberCount > 0;
                  return (
                    <li
                      key={`${w.start}-${w.user_id.join()}`}
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5",
                        everyone
                          ? "border-lime/50 bg-lime/10 glow-ring"
                          : "border-border bg-background",
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            "font-display text-lg font-semibold",
                            everyone && "text-lime",
                          )}
                        >
                          {formatWindow(w.start, w.end)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {w.days} {w.days === 1 ? "day" : "days"} ·{" "}
                          {w.user_id.map(nameFor).join(", ")}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                          everyone
                            ? "bg-lime text-primary-foreground"
                            : "bg-surface-2 text-muted-foreground",
                        )}
                      >
                        {everyone ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="size-3" /> Everyone free
                          </span>
                        ) : (
                          `${w.user_id.length} of ${memberCount} free`
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPlanTarget({ start: w.start, end: w.end })
                        }
                        className="shrink-0 rounded-full border border-lime/40 px-3 py-1 text-xs font-semibold text-lime transition-colors hover:bg-lime/15"
                      >
                        Plan this
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Calendar + participants */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            {/* Calendar */}
            <section className="min-w-0 rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Mark when you&apos;re free
                </h2>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-lime" /> you
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-lime/30" /> others
                  </span>
                </div>
              </div>

              <Calendar
                mode="range"
                selected={range}
                onSelect={(r) => {
                  setRange(r);
                  if (r?.from) {
                    setPlanTarget({
                      start: dayKey(r.from),
                      end: dayKey(r.to ?? r.from),
                    });
                  }
                }}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
                modifiers={{ mine: myDays, others: groupDays }}
                modifiersClassNames={{
                  mine: "[&>button]:ring-1 [&>button]:ring-lime/70 [&>button]:text-lime",
                  others: "[&>button]:bg-lime/10",
                }}
                className="pointer-events-auto mt-3"
              />

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Your dates
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {range?.from ? (
                    <li className="inline-flex items-center gap-2 rounded-full border border-lime/50 bg-lime/10 px-3 py-1.5 text-xs text-lime">
                      {formatWindow(
                        dayKey(range.from),
                        dayKey(range.to ?? range.from),
                      )}
                      <button
                        type="button"
                        aria-label="Clear selection"
                        onClick={() => setRange(undefined)}
                        className="hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ) : null}
                  {mine.map((a) => (
                    <li
                      key={a.date_id}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                    >
                      {formatWindow(a.start_date, a.end_date)}
                      <button
                        type="button"
                        aria-label="Remove dates"
                        // onClick={() => removeRange.mutate(a.date_id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                  {!range?.from && mine.length === 0 ? (
                    <li className="text-xs text-muted-foreground">
                      Click one day for a single date, or two for a range.
                    </li>
                  ) : null}
                </ul>
                <Button
                  className="mt-3 w-full sm:w-auto"
                  // disabled={!range?.from || addRange.isPending}
                  // onClick={() => range && addRange.mutate(range)}
                >
                  Add these dates
                </Button>
              </div>
            </section>

            {/* Members + their dates */}
            <section className="min-w-0 space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Participants
              </h2>
              {(circle?.tbl2cmtbl).map((m) => {
                const theirs = availableDates.filter(
                  (a) => a.user_id === m.user_id,
                );
                // const profile = circle?.data?.tbl2cmtbl.find(
                //   (p) => p.user_id === m.user_id,
                // );
                return (
                  <div
                    key={m.member_id}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-border">
                        {/* {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt="" />
                        ) : null} */}
                        <AvatarFallback className="bg-surface-2 text-xs">
                          {nameFor(m.member_id).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">
                        {nameFor(m.member_id)}
                        {m.user_id === user?.id ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            you
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {theirs.length === 0 ? (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Hasn&apos;t marked any dates yet.
                      </p>
                    ) : (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {theirs.map((a) => (
                          <li
                            key={a.date_id}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                          >
                            {formatWindow(a.start_date, a.end_date)}
                            {a.user_id === currentUserId ? (
                              <button
                                type="button"
                                aria-label="Remove dates"
                                // onClick={() => removeRange.mutate(a.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {mine.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Tip: add every window that works for you — overlaps are found
                  automatically.
                </p>
              ) : null}
            </section>
          </div>
        </div>

        {/* ── Right column: activity panel ── */}
        <div className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
          <PlanPanel circle_id={id} plans={itinerary} />
        </div>
      </div>
    </>
  );
}
