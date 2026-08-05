import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO } from "date-fns";
import { ArrowLeft, Check, Copy, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { PlanPanel } from "@/components/PlanPanel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { fetchCircleDetail } from "@/lib/queries";
import { computeOverlaps, dayKey, formatWindow } from "@/lib/availability";
// import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/circles/$circleId")({
  head: () => ({
    meta: [
      { title: "Circle dates · whenfree" },
      {
        name: "description",
        content:
          "See everyone's free dates in this circle and the best window when the whole group is available.",
      },
      { property: "og:title", content: "Circle dates · whenfree" },
      {
        property: "og:description",
        content: "The best dates when your whole circle is free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CircleDetail,
});

function CircleDetail() {
  const { circleId } = Route.useParams();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [range, setRange] = useState<DateRange | undefined>();
  const [planTarget, setPlanTarget] = useState<
    { start: string; end: string } | undefined
  >();

  const detail = useQuery({
    queryKey: ["circle", circleId],
    queryFn: () => fetchCircleDetail(circleId),
  });

  const nameFor = (id: string) => {
    const p = detail.data?.profiles.find((x) => x.id === id);
    return p?.display_name ?? p?.email ?? "Someone";
  };

  const overlaps = useMemo(
    () => computeOverlaps(detail.data?.availabilities ?? []),
    [detail.data],
  );
  const memberCount = detail.data?.members.length ?? 0;
  const best = overlaps.slice(0, 5);

  const addRange = useMutation({
    mutationFn: async (r: DateRange) => {
      if (!user || !r.from) throw new Error("Pick a date first");
      const { error } = await supabase.from("availabilities").insert({
        circle_id: circleId,
        user_id: user.id,
        start_date: dayKey(r.from),
        end_date: dayKey(r.to ?? r.from),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setRange(undefined);
      toast.success("Dates added");
      queryClient.invalidateQueries({ queryKey: ["circle", circleId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRange = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availabilities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["circle", circleId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (detail.isLoading) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Loading circle…</p>
      </AppShell>
    );
  }
  if (detail.isError || !detail.data) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">
          This circle isn&apos;t available.
        </p>
      </AppShell>
    );
  }

  const { circle, members, availabilities } = detail.data;
  const mine = availabilities.filter((a) => a.user_id === user?.id);
  const marked = new Set(availabilities.map((a) => a.user_id));

  const daysOf = (rows: typeof availabilities) =>
    rows.flatMap((a) =>
      eachDayOfInterval({
        start: parseISO(a.start_date),
        end: parseISO(a.end_date),
      }),
    );
  const myDays = daysOf(mine);
  const groupDays = daysOf(availabilities.filter((a) => a.user_id !== user?.id));

  return (
    <AppShell>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
        {/* ── Left column: planning content ── */}
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/circles"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3" /> All circles
            </Link>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(circle.code);
                toast.success("Invite code copied");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-lime/40 bg-lime/10 px-4 py-2.5 font-mono text-sm tracking-[0.35em] text-lime transition-colors hover:bg-lime/20"
            >
              {circle.code}
              <Copy className="size-3.5" />
            </button>
          </div>

          <header className="rounded-2xl border border-border bg-surface p-6">
        <div>
          <h1 className="text-4xl font-bold">{circle.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {marked.size} marked their dates
          </p>
        </div>
          </header>

      {/* Best dates */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="size-4 text-lime" /> Best dates to meet
        </h2>
        {best.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing yet — mark your free dates below and nudge the others.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {best.map((w) => {
              const everyone = w.userIds.length === memberCount && memberCount > 0;
              return (
                <li
                  key={`${w.start}-${w.userIds.join()}`}
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
                      {w.userIds.map(nameFor).join(", ")}
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
                      `${w.userIds.length} of ${memberCount} free`
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
            numberOfMonths={2}
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
                  {formatWindow(dayKey(range.from), dayKey(range.to ?? range.from))}
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
                  key={a.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                >
                  {formatWindow(a.start_date, a.end_date)}
                  <button
                    type="button"
                    aria-label="Remove dates"
                    onClick={() => removeRange.mutate(a.id)}
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
              disabled={!range?.from || addRange.isPending}
              onClick={() => range && addRange.mutate(range)}
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
          {members.map((m) => {
            const theirs = availabilities.filter((a) => a.user_id === m.user_id);
            const profile = detail.data.profiles.find((p) => p.id === m.user_id);
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-border">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="" />
                    ) : null}
                    <AvatarFallback className="bg-surface-2 text-xs">
                      {nameFor(m.user_id).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">
                    {nameFor(m.user_id)}
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
                        key={a.id}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                      >
                        {formatWindow(a.start_date, a.end_date)}
                        {a.user_id === user?.id ? (
                          <button
                            type="button"
                            aria-label="Remove dates"
                            onClick={() => removeRange.mutate(a.id)}
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
          <PlanPanel
            circleId={circleId}
            userId={user?.id}
            plans={detail.data.plans}
            target={planTarget}
            onClearTarget={() => setPlanTarget(undefined)}
            nameFor={nameFor}
          />
        </div>
      </div>
    </AppShell>
  );
}