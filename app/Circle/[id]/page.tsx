// import { useMemo, useState } from "react";
// import Link from "next/link";
// import type { DateRange } from "react-day-picker";
// import { eachDayOfInterval, parseISO } from "date-fns";
// import { ArrowLeft, Check, Copy, Sparkles, Trash2, X } from "lucide-react";
// import { toast } from "sonner";
// import { PlanPanel } from "@/components/planner";
// import { Button } from "@/components/button";
// import { Calendar } from "@/components/calendar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
// import { supabase } from "@/integrations/supabase/client";
// // import { fetchCircleDetail } from "@/lib/queries";
// import { computeOverlaps, dayKey, formatWindow } from "@/lib/availability";
// import { useSession } from "@/hooks/useSession";
// import { cn } from "@/lib/utils";
import { PageProps } from "@/lib/types";
import { GetCircle } from "@/backend/read";
import CircleDetailClient from "@/components/circleDetailClient";


export default async function CircleDetail({ params } : PageProps) {
  const { id } = await params ;

  const detail = await GetCircle(id);


  // const queryClient = useQueryClient();
  // const [range, setRange] = useState<DateRange | undefined>();
  // const [planTarget, setPlanTarget] = useState<
  //   { start: string; end: string } | undefined
  // >();


  // const detail = useQuery({
  //   queryKey: ["circle", id],
  //   queryFn: () => fetchCircleDetail(id),
  // });
  
  // const nameFor = (id: string) => {
  //   const p = detail.data?. .find((x) => x.id === id);
  //   return p?.display_name ?? p?.email ?? "Someone";
  // };

  // const overlaps = useMemo(
  //   () => computeOverlaps(detail.data?.availabilities ?? []),
  //   [detail.data],
  // );
  // const memberCount = detail.data?.members.length ?? 0;
  // const best = overlaps.slice(0, 5);

  // if (detail.isLoading) {
  //   return (
  //     <>
  //       <p className="text-sm text-muted-foreground">Loading circle…</p>
  //     </>
  //   );
  // }
  // if (detail.isError || !detail.data) {
  //   return (
  //     <>
  //       <p className="text-sm text-muted-foreground">
  //         This circle isn&apos;t available.
  //       </p>
  //     </>
  //   );
  // }

  // const { circle, members, availabilities } = detail.data;
  // const mine = availabilities.filter((a) => a.user_id === user?.id);
  // const marked = new Set(availabilities.map((a) => a.user_id));

  // const daysOf = (rows: typeof availabilities) =>
  //   rows.flatMap((a) =>
  //     eachDayOfInterval({
  //       start: parseISO(a.start_date),
  //       end: parseISO(a.end_date),
  //     }),
  //   );
  // const myDays = daysOf(mine);
  // const groupDays = daysOf(
  //   availabilities.filter((a) => a.user_id !== user?.id),
  // );

  return (
    <>
      <div>
         <CircleDetailClient id={id} detail={detail} />
      </div>
    </>
  );
}
