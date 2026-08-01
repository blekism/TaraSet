import { Button } from "@/components/button";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Start a circle",
    body: "Name your group and get a six-character code to share.",
  },
  {
    n: "02",
    title: "Everyone marks dates",
    body: "A single day or a range — 21 March to 1 April, whatever works.",
  },
  {
    n: "03",
    title: "See the overlap",
    body: "The window where the whole circle is free rises to the top.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background dot-grid">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-lime" />
          <span className="font-display text-lg font-bold tracking-tight">
            whenfree
          </span>
        </div>

        <Button asChild size="sm" variant="ghost">
          <Link href="/auth">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-5">
        <section className="py-24 text-center sm:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-lime">
            group plans, solved
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[0.95] sm:text-7xl">
            Find the date
            <br />
            <span className="text-lime">everyone</span> is free.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Stop scrolling the group chat. Everyone marks the days or ranges
            they&apos;re available, and whenfree works out the next window that
            fits the whole circle.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href={"/auth"}>{"Continue with Google"}</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-surface p-7">
              <span className="font-mono text-xs text-lime">{s.n}</span>
              <h2 className="mt-3 text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </section>

        <footer className="py-16 text-center text-xs text-muted-foreground">
          whenfree
        </footer>
      </main>
    </div>
  );
}
