"use client";

import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { ButtonProps } from "@/lib/types";

export default function AddDestinationBtn({ onClick }: ButtonProps) {
  return (
    <Button className="gap-2" onClick={onClick}>
      <Plus className="size-4" /> Add destination
    </Button>
  );
}
