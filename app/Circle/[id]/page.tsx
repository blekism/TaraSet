import { useState } from "react";
import { ArrowRight, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyCircles, makeCode } from "@/lib/queries";

function CirclesPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

    const circles = useQuery({ queryKey: ["circles"], queryFn: fetchMyCircles });

    const create = useMutation({
      mutationFn: async (circleName: string) => {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData.user?.id;
        if (!uid) throw new Error("Not signed in");
        const { data, error } = await supabase
          .from("circles")
          .insert({ name: circleName, code: makeCode(), created_by: uid })
          .select()
          .single();
        if (error) throw error;
        const { error: mErr } = await supabase
          .from("circle_members")
          .insert({ circle_id: data.id, user_id: uid });
        if (mErr) throw mErr;
        return data;
      },
      onSuccess: (data) => {
        setName("");
        toast.success(`Circle created — code ${data.code}`);
        queryClient.invalidateQueries({ queryKey: ["circles"] });
      },
      onError: (e: Error) => toast.error(e.message),
    });

    const join = useMutation({
      mutationFn: async (joinCode: string) => {
        const { error } = await supabase.rpc("join_circle_by_code", {
          _code: joinCode,
        });
        if (error) throw error;
      },
      onSuccess: () => {
        setCode("");
        toast.success("Joined the circle");
        queryClient.invalidateQueries({ queryKey: ["circles"] });
      },
      onError: (e: Error) => toast.error(e.message),
    });

  return (
    <>
      <h1 className="text-4xl font-bold">Your circles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A circle is a group of friends trying to find a date that works.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <form
          className="rounded-xl border border-border bg-surface p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) create.mutate(name.trim());
            }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Start a circle
          </h2>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Weekend crew"
            maxLength={60}
            className="mt-3 bg-background"
          />
          <Button
            type="submit"
            disabled={!name.trim() || create.isPending}
            className="mt-3 w-full"
          >
            <Plus className="size-4" /> Create
          </Button>
        </form>

        <form
          className="rounded-xl border border-border bg-surface p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) join.mutate(code.trim());
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Join with a code
          </h2>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="A7K2QX"
            maxLength={6}
            className="mt-3 bg-background font-mono tracking-[0.35em]"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!code.trim() || join.isPending}
            className="mt-3 w-full"
          >
            Join circle
          </Button>
        </form>
      </div>

      <div className="mt-10 space-y-3">
        {circles.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : circles.data?.length ? (
          circles.data.map((c) => (
            <Link
              key={c.id}
              to="/circles/$circleId"
              params={{ circleId: c.id }}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-lime/50"
            >
              <div>
                <p className="font-display text-lg font-semibold">{c.name}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" /> {c.member_count}
                  </span>
                  <span className="font-mono tracking-widest text-lime">
                    {c.code}
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
