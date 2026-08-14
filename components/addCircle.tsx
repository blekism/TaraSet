"use client";

import { useState, useEffect, useActionState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { CreateCircle, JoinCircle } from "@/backend/actions";
import { toast } from "sonner";

const initialState = {
  code: 0,
  message: "",
  data: undefined,
};

export default function addCircle() {

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [createState, createFormAction, createPending] = useActionState(CreateCircle, initialState);
    const [joinState, joinFormAction, joinPending] = useActionState(JoinCircle, initialState);

    useEffect(() => {
    if (!createState.message) return;

    if (createState.code === 1) {
      toast.success(createState.message);
      setName("");
    } else {
      toast.error(createState.message);
    }
  }, [createState]);

  useEffect(() => {
    if (!joinState.message) return;

    if (joinState.code === 1) {
      toast.success(joinState.message);
      setName("");
    } else {
      toast.error(joinState.message);
    }
  }, [joinState]);

  if (createPending || joinPending ) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        Processing...
      </div>
    );
  }

    return (
        <>
        <form
          action={createFormAction}
          className="rounded-xl border border-border bg-surface p-5"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   if (name.trim()) create.mutate(name.trim());
          // }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Start a circle
          </h2>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Weekend crew"
            maxLength={60}
            className="mt-3 bg-background"
          />
          <Button
            type="submit"
            disabled={!name.trim() || createPending}
            className="mt-3 w-full"
          >
            <Plus className="size-4" /> Create
          </Button>
        </form>

        <form
          action={joinFormAction}
          className="rounded-xl border border-border bg-surface p-5"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   if (code.trim()) join.mutate(code.trim());
          // }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Join with a code
          </h2>
          <Input
            name="circle_code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="A7K2QX"
            maxLength={6}
            className="mt-3 bg-background font-mono tracking-[0.35em]"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!code.trim() || joinPending}
            className="mt-3 w-full"
          >
            Join circle
          </Button>
        </form>
        </>
    )
}