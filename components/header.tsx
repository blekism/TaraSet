"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

export default function Header() {
  const name = "John doe";
  const avatar = "";

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/circles" className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-lime" />
          <span className="font-display text-lg font-bold tracking-tight">
            TaraSet!
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border border-border">
            {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
            <AvatarFallback className="bg-surface-2 text-xs">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            //   onClick={signOut}
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
