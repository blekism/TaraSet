import { ArrowRight, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
// import { fetchMyCircles, makeCode } from "@/lib/queries";
import AddCircle from "@/components/addCircle";
import { createClient } from "@/lib/server";
import { GetCircles } from "@/backend/read";
import Link from "next/link";

export default async function CirclesPage() {
  const supabase = await createClient();

  const sessionData = await supabase.auth.getUser();

  if(!sessionData.data.user) {
    return;
  }

  const user_id = sessionData.data.user?.id;

  const circles = await GetCircles(user_id);
  console.log("my circles: ", circles.data);


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
        {circles.data!.length > 0 ? (
          circles.data!.map((circle) => (
            <Link
              key={circle.circle_id}
              href={`/Circle/${circle.circle_id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-lime/50"
            >
              <div>
                <p className="font-display text-lg font-semibold">{circle.circles_tbl.circle_name}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" /> {circle.circles_tbl.total_members}
                  </span>
                  <span className="font-mono tracking-widest text-lime">
                    {circle.circles_tbl.circle_code}
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
