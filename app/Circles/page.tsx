import { ArrowRight, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
// import { fetchMyCircles, makeCode } from "@/lib/queries";
import AddCircle from "@/components/addCircle";

export default function CirclesPage() {
  const supabase = await createClient();

  const 

  return (
    <>
      <h1 className="text-4xl font-bold">Your circles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A circle is a group of friends trying to find a date that works.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <AddCircle />
      </div>

      <div className="mt-10 space-y-3">
        {circles.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : circles.data?.length ? (
          circles.data.map((c) => (
            <Link
              key={c.id}
              to="/circles/$circleId"
              params={{ circleId: c.id }}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-lime/50"
            >
              <div>
                <p className="font-display text-lg font-semibold">{c.name}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" /> {c.member_count}
                  </span>
                  <span className="font-mono tracking-widest text-lime">
                    {c.code}
                  </span>
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
            No circles yet. Create one above and share the code.
          </p>
        )}
      </div>
    </>
  );
}
