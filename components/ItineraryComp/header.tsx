"use client";

import { Button } from "@/components/button";
import { ButtonProps, HeaderProps } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import ItineraryModal from "@/components/ItineraryComp/itinerary_modal";
import { useState } from "react";

export default function HeaderModule({
  id,
  data,
  itineraryLength,
  name,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <Link
            href={`/circles/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Back to {name}
          </Link>
          <h1 className="mt-2 text-4xl font-bold">Itinerary</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itineraryLength}{" "}
            {itineraryLength === 1 ? "destination" : "destinations"} planned
          </p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Add destination
        </Button>
      </header>

      {open && <ItineraryModal initialData={data} circleId={id} />}
    </>
  );
}
