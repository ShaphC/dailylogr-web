import { CalendarDays, FileText, Flame } from "lucide-react";
import { ProgressCompanyFilter } from "@/components/progress/progress-company-filter";
import { getCompanies } from "@/lib/services/companies";
import { getProgressData } from "@/lib/services/progress";
import type { DocCompany } from "@/lib/types";

function getCompanyMap(companies: DocCompany[]) {
  return new Map(companies.map((company) => [company.id, company.name]));
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{
    company?: string;
  }>;
}) {
  const params = await searchParams;

  const companyId = params.company ?? "";

  const [companies, progress] = await Promise.all([
    getCompanies(),
    getProgressData(companyId || null),
  ]);

  const companyMap = getCompanyMap(companies);

  const selectedCompany = companyId
    ? (companyMap.get(companyId) ?? null)
    : null;

  const maxTypeCount = Math.max(
    1,
    ...progress.typeCounts.map((item) => item.count),
  );

  const maxCompanyCount = Math.max(
    1,
    ...progress.companyCounts.map((item) => item.count),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Documentation</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Progress
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            See how consistently you're building your documentation history.
          </p>
        </div>

        <ProgressCompanyFilter companies={companies} companyId={companyId} />
      </header>

      {selectedCompany && (
        <div className="rounded-xl border bg-card px-4 py-3 text-sm">
          Showing progress for{" "}
          <span className="font-medium">{selectedCompany}</span>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Flame}
          value={progress.currentStreak}
          label={progress.currentStreak === 1 ? "Day streak" : "Day streak"}
        />

        <MetricCard
          icon={FileText}
          value={progress.thisMonthCount}
          label="This month"
        />

        <MetricCard
          icon={CalendarDays}
          value={progress.activeDaysThisMonth}
          label="Active days"
        />
      </section>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">Last 30 days</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Days where you documented something.
          </p>
        </div>

        <div className="mt-6 inline-grid grid-cols-[repeat(7,1rem)] gap-1.5">
          {progress.last30Days.map((day) => {
            const active = day.count > 0;

            return (
              <div
                key={day.date}
                title={`${formatActivityDate(day.date)}: ${day.count} ${
                  day.count === 1 ? "item" : "items"
                }`}
                className={`h-4 w-4 rounded-[4px] border ${
                  active ? "border-primary bg-primary" : "bg-muted/40"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm border bg-muted/40" />
            No documentation
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm border border-primary bg-primary" />
            Documented
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-medium">Documentation breakdown</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              What you've been documenting.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {progress.typeCounts.map((item) => (
              <BreakdownRow
                key={item.type}
                label={item.label}
                count={item.count}
                max={maxTypeCount}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-medium">By company</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Where your documentation belongs.
            </p>
          </div>

          {progress.companyCounts.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No documentation yet.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {progress.companyCounts.map((item) => (
                <BreakdownRow
                  key={item.companyId ?? "none"}
                  label={
                    item.companyId
                      ? (companyMap.get(item.companyId) ?? "Unknown company")
                      : "No company"
                  }
                  count={item.count}
                  max={maxCompanyCount}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Flame;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function BreakdownRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const width = count === 0 ? 0 : Math.max(5, (count / max) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm">{label}</span>

        <span className="text-sm font-medium">{count}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{
            width: `${width}%`,
          }}
        />
      </div>
    </div>
  );
}
