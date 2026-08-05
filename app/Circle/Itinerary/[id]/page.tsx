import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  MapPin,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { ACTIVITIES, activityMeta } from "@/components/PlanPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatWindow } from "@/lib/availability";
// import { fetchCircleDetail } from "@/lib/queries";
// import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

function ItineraryPage() {
  const { circleId } = Route.useParams();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const [activity, setActivity] = useState("food");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [food, setFood] = useState("");
  const [note, setNote] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const detail = useQuery({
    queryKey: ["circle", circleId],
    queryFn: () => fetchCircleDetail(circleId),
  });

  const nameFor = (id: string) => {
    const p = detail.data?.profiles.find((x) => x.id === id);
    return p?.display_name ?? p?.email ?? "Someone";
  };

  const destinations = useMemo(
    () =>
      [...(detail.data?.plans ?? [])].sort((a, b) =>
        a.start_date.localeCompare(b.start_date),
      ),
    [detail.data],
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

  const selected = destinations.find((d) => d.id === selectedId);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!start) throw new Error("Pick a start date");
      const { error } = await supabase.from("plans").insert({
        circle_id: circleId,
        user_id: user.id,
        start_date: start,
        end_date: end || start,
        activity,
        title: title.trim() || null,
        location: location.trim() || null,
        food: food.trim() || null,
        note: note.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setLocation("");
      setFood("");
      setNote("");
      setStart("");
      setEnd("");
      setOpen(false);
      toast.success("Destination added");
      queryClient.invalidateQueries({ queryKey: ["circle", circleId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      queryClient.invalidateQueries({ queryKey: ["circle", circleId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (detail.isLoading) {
    return (
      <>
        <p className="text-sm text-muted-foreground">Loading itinerary…</p>
      </>
    );
  }
  if (detail.isError || !detail.data) {
    return (
      <>
        <p className="text-sm text-muted-foreground">
          This itinerary isn&apos;t available.
        </p>
      </>
    );
  }

  const SelectedIcon = selected ? activityMeta(selected.activity).icon : MapPin;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6">
          <div>
            <Link
              to="/circles/$circleId"
              params={{ circleId }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3" /> Back to {detail.data.circle.name}
            </Link>
            <h1 className="mt-2 text-4xl font-bold">Itinerary</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {destinations.length}{" "}
              {destinations.length === 1 ? "destination" : "destinations"}{" "}
              planned
            </p>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add destination
          </Button>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          {/* Destinations */}
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
                {destinations.map((d, i) => {
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

          {/* Destination details */}
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
                      <SelectedIcon className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selected.title ||
                          activityMeta(selected.activity).label}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Added by {nameFor(selected.user_id)}
                      </p>
                    </div>
                  </div>
                  {selected.user_id === user?.id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-destructive"
                      onClick={() => remove.mutate(selected.id)}
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Detail
                    icon={<CalendarDays className="size-4" />}
                    label="Dates"
                    value={formatWindow(selected.start_date, selected.end_date)}
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

                {/* Collapsible map */}
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
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          selected.location,
                        )}&output=embed`}
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
      </div>

      {/* Itinerary form modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a destination</DialogTitle>
            <DialogDescription>
              Where are we going, when, and what&apos;s the plan?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Activity
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
                          : "border-border bg-background text-muted-foreground hover:border-lime/30",
                      )}
                    >
                      <Icon className="size-4" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="text-xs text-muted-foreground">
                Start date
                <Input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="mt-1 bg-background"
                />
              </label>
              <label className="text-xs text-muted-foreground">
                End date
                <Input
                  type="date"
                  value={end}
                  min={start || undefined}
                  onChange={(e) => setEnd(e.target.value)}
                  className="mt-1 bg-background"
                />
              </label>
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name — “Sunset hike”"
              maxLength={80}
              className="bg-background"
            />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location — e.g. Camden Market, London"
              maxLength={120}
              className="bg-background"
            />
            <Input
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="Food & drinks — e.g. BBQ, ramen"
              maxLength={120}
              className="bg-background"
            />
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else — budget, who's driving…"
              maxLength={300}
              rows={3}
              className="resize-none bg-background"
            />
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              disabled={!start || save.isPending}
              onClick={() => save.mutate()}
            >
              Add destination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
