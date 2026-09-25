import Link from "next/link";
import { Keyboard, Mic, ArrowRight } from "lucide-react";

export default function DocumentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-8">
        <p className="text-sm text-muted-foreground">Document</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Document something
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Capture it first. Organize it when you're ready.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/document/manual"
          className="group rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Keyboard className="h-5 w-5" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Manual</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Type what happened.
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/document/record"
          className="group rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mic className="h-5 w-5" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Record</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Speak and capture a live transcript.
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
