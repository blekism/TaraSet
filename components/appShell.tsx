
import Link from "next/link";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

export function AppShell({ children }: { children: ReactNode }) {
  // const { user } = useSession();
  // const navigate = useNavigate();
  // const queryClient = useQueryClient();

  // const name =
  //   (user?.user_metadata?.["full_name"] as string | undefined) ??
  //   user?.email ??
  //   "";
  // const avatar = user?.user_metadata?.["avatar_url"] as string | undefined;

  // async function signOut() {
  //   await queryClient.cancelQueries();
  //   queryClient.clear();
  //   await supabase.auth.signOut();
  //   navigate({ to: "/auth", replace: true });
  // }

  return (
    <div className="min-h-screen bg-background dot-grid">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/circles" className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-lime" />
            <span className="font-display text-lg font-bold tracking-tight">
              whenfree
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border border-border">
              {/* {avatar ? <AvatarImage src={avatar} alt={name} /> : null} */}
              <AvatarFallback className="bg-surface-2 text-xs">
                {/* {name.slice(0, 2).toUpperCase()} */}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              // onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}