import { PageProps } from "@/lib/types";
import CircleDetailClient from "@/components/circleDetailClient";

export default async function CircleDetail({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <div>
        <CircleDetailClient id={id} />
      </div>
    </>
  );
}
