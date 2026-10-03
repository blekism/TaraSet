"use client";

import { ArrowRight, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
// import { fetchMyCircles, makeCode } from "@/lib/queries";
// import AddCircle from "@/components/addCircle";
import { GetCircles } from "@/backend/read.controller";
import Link from "next/link";
import { Circle } from "@/lib/types";
import { useEffect, useState } from "react";

export default function CirclesPage() {
  // const circles = await GetCircles();
  // console.log("my circles: ", circles);

  const [allCircles, setAllCircles] = useState([]);

  useEffect(() => {
    async function loadCircles() {
      const circles = await GetCircles();
      setAllCircles(circles.data);
    }

    loadCircles();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold">Your circles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A circle is a group of friends trying to find a date that works.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* <AddCircle /> */}
      </div>

      <div className="mt-10 space-y-3">
        {allCircles.length > 0 ? (
          allCircles.map((circle: Circle) => (
            <Link
              key={circle.circle_id}
              href={`/Circle/${circle.circle_id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-lime/50"
            >
              <div>
                <p className="font-display text-lg font-semibold">
                  {circle.circle_name}
                </p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" /> {circle.total_members}
                  </span>
                  <span className="font-mono tracking-widest text-lime">
                    {circle.circle_code}
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
