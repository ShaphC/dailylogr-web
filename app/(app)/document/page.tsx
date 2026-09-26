import Link from "next/link";
import { ArrowRight, Keyboard, Mic } from "lucide-react";

export default function DocumentPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Document</h1>

        <p className="mt-1 text-[15px] text-muted-foreground">
          Capture what happened. Organize it when you&apos;re ready.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-bold tracking-tight">
          How do you want to capture it?
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/document/manual"
            className="group flex min-h-48 flex-col rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40 sm:min-h-56 sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-xl border bg-card text-foreground">
              <Keyboard className="size-5" />
            </div>

            <div className="mt-auto flex items-end justify-between gap-6 pt-8">
              <div>
                <h3 className="text-lg font-bold">Manual</h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Type what happened and add details when you need them.
                </p>
              </div>

              <ArrowRight className="mb-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </div>
          </Link>

          <Link
            href="/document/record"
            className="group flex min-h-48 flex-col rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40 sm:min-h-56 sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-xl border bg-card text-foreground">
              <Mic className="size-5" />
            </div>

            <div className="mt-auto flex items-end justify-between gap-6 pt-8">
              <div>
                <h3 className="text-lg font-bold">Record</h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Speak naturally and capture a live transcript as you go.
                </p>
              </div>

              <ArrowRight className="mb-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </div>
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
        <p className="text-[13px] font-semibold text-muted-foreground">
          Keep it simple
        </p>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground">
          You don&apos;t need to classify everything before documenting it.
          Capture what happened first. Company, type, client information, and
          other details can be added when they&apos;re useful.
        </p>
      </section>
    </div>
  );
}
