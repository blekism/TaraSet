"use client";

import { useState, useEffect, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Login } from "@/backend/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  message: "",
};

export default function LoginHandlerForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, pending] = useActionState(Login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  if (pending) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        Logging in...
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-panel p-6">
        <h1 className="text-lg font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Access your paper analyses.
        </p>
      </div>

      <form action={formAction} className="mt-5 space-y-3">
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="you@school.edu"
          autoComplete="email"
          required
          name="email"
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
          autoComplete={"current-password"}
          required
          name="password"
        />

        {/* <input type="hidden" name="mode" value={mode} /> REFERENCE FOR ADDTION OF MORE DATA */}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <>
          No account yet?{" "}
          <button
            className="text-brand hover:underline"
            onClick={() => router.push("/Register")}
          >
            Register
          </button>
        </>
      </div>
    </>
  );
}

function Field(props: {
  label: string;
  value: string;
  name: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-muted-foreground">{props.label}</div>
      <input
        className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
      />
    </label>
  );
}
