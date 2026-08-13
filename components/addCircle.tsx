"use client";

import { useState, useEffect, useActionState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { CreateCircle } from "@/backend/actions";
import { toast } from "sonner";

const initialState = {
  code: 0,
  message: "",
  data: undefined,
};

export default function addCircle() {

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [state, formAction, pending] = useActionState(CreateCircle, initialState);

    useEffect(() => {
    if (!state.message) return;

    if (state.code === 1) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  if (pending) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        Registering...
      </div>
    );
  }

    return (
        <>
        <form
          action={formAction}
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
        </>
    )
}