"use client";

import { useEffect, useState, use } from "react";
// import { ArrowLeft, Circle, Plus } from "lucide-react";
import { Button } from "@/components/button";
import { GetCircle, GetItinerary } from "@/backend/read.controller";
import { PageProps } from "@/lib/types";
import Link from "next/link";
import ItineraryClient from "@/components/ItineraryComp/dest_card";
import HeaderModule from "@/components/ItineraryComp/header";
import { Circle, ItineraryShape } from "@/lib/types";
import { toast } from "sonner";

export default function ItineraryPage({ params }: PageProps) {
  const { id } = use(params);

  const [circle, setCircle] = useState<Circle | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryShape[] | null>(null);
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
      console.log(itineraryData.data);
      setIsLoading(false);
    }

    data();
  }, []);

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

  if (isLoading) {
    return <div>loading</div>;
  }

  if (error || !circle || !itinerary) {
    return <div>error</div>;
  }
  return (
    <>
      <div className="space-y-6">
        <HeaderModule
          id={id}
          data={itinerary}
          itineraryLength={itinerary.length || 0}
          name={circle.circle_name || ""}
        />

        <ItineraryClient initialData={itinerary} />
      </div>
    </>
  );
}
