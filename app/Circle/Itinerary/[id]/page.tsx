import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/button";
import { GetCircle, GetItinerary } from "@/backend/read";
import { PageProps } from "@/lib/types";
import Link from "next/link";
import ItineraryClient from "@/components/ItineraryComp/dest_card";
import HeaderModule from "@/components/ItineraryComp/header";

export default async function ItineraryPage({ params }: PageProps) {
  const { id } = await params;

  const detail = await GetCircle(id);
  const itinerary = await GetItinerary(id);

  // if (detail.isLoading) {
  //   return (
  //     <>
  //       <p className="text-sm text-muted-foreground">Loading itinerary…</p>
  //     </>
  //   );
  // }
  // if (detail.isError || !detail.data) {
  //   return (
  //     <>
  //       <p className="text-sm text-muted-foreground">
  //         This itinerary isn&apos;t available.
  //       </p>
  //     </>
  //   );
  // }

  // const SelectedIcon = selected ? activityMeta(selected.activity).icon : MapPin;

  return (
    <>
      <div className="space-y-6">
        <HeaderModule
          id={id}
          data={itinerary}
          itineraryLength={itinerary.data?.length || 0}
          name={detail.data?.circle_name || ""}
        />

        <ItineraryClient initialData={detail.data} />
      </div>
    </>
  );
}
