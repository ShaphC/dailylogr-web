export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">Today</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Your documentation
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Capture what you did. Organize it when you're ready.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {["Work Done", "Client Visits", "Equipment", "Travel", "Expenses"].map(
          (label) => (
            <div key={label} className="rounded-xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold">—</p>
            </div>
          ),
        )}
      </section>

      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent documentation</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest captured work and notes.
            </p>
          </div>
        </div>

        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading your documentation will come next.
        </div>
      </section>
    </div>
  );
}
