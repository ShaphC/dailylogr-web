import { getDocumentationMetrics } from "@/lib/services/metrics";
import { getDocumentationStreak } from "@/lib/services/streak";
import {
  getMonthEndDateKey,
  getMonthStartDateKey,
} from "@/lib/services/date-range";

export default async function HomePage() {
  const fromDate = getMonthStartDateKey();
  const toDate = getMonthEndDateKey();

  const [metrics, streak] = await Promise.all([
    getDocumentationMetrics({
      fromDate,
      toDate,
    }),
    getDocumentationStreak(),
  ]);

  const metricItems = [
    {
      label: "Work Done",
      value: metrics.workDone,
    },
    {
      label: "Client Visits",
      value: metrics.clientVisits,
    },
    {
      label: "Equipment",
      value: metrics.equipment,
    },
    {
      label: "Travel",
      value: metrics.travel,
    },
    {
      label: "Expenses",
      value: metrics.expenses,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">This month</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Your documentation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Capture what you did. Organize it when you're ready.
        </p>
      </section>

      <section className="flex items-center gap-3">
        <div className="rounded-full border bg-card px-4 py-2 text-sm">
          <span className="font-medium">{streak}</span>
          <span className="ml-1 text-muted-foreground">
            day{streak === 1 ? "" : "s"} documented
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metricItems.map((item) => (
          <div key={item.label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
