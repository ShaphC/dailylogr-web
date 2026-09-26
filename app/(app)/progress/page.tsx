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
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress</h1>

          <p className="mt-1 text-[15px] text-muted-foreground">
            See how consistently you&apos;re building your documentation
            history.
          </p>
        </div>

        <ProgressCompanyFilter companies={companies} companyId={companyId} />
      </header>

      {selectedCompany && (
        <div className="mt-5 rounded-xl border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing progress for{" "}
            <span className="font-semibold text-foreground">
              {selectedCompany}
            </span>
          </p>
        </div>
      )}

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard
          value={progress.currentStreak}
          label="Current streak"
          unit={progress.currentStreak === 1 ? "day" : "days"}
          featured
        />

        <MetricCard
          value={progress.thisMonthCount}
          label="This month"
          unit={progress.thisMonthCount === 1 ? "item" : "items"}
        />

        <MetricCard
          value={progress.activeDaysThisMonth}
          label="Active days"
          unit={progress.activeDaysThisMonth === 1 ? "day" : "days"}
          className="col-span-2 sm:col-span-1"
        />
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Last 30 days</h2>

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
                  active ? "border-foreground bg-foreground" : "bg-muted/40"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-[3px] border bg-muted/40" />
            <span>No documentation</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-[3px] border border-foreground bg-foreground" />
            <span>Documented</span>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Documentation breakdown
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              What you&apos;ve been documenting.
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
            <h2 className="text-xl font-bold tracking-tight">By company</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Where your documentation belongs.
            </p>
          </div>

          {progress.companyCounts.length === 0 ? (
            <div className="mt-6 rounded-xl bg-muted/40 px-4 py-4">
              <p className="text-sm text-muted-foreground">
                No documentation yet.
              </p>
            </div>
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
  value,
  label,
  unit,
  featured = false,
  className = "",
}: {
  value: number;
  label: string;
  unit: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-32 flex-col justify-between rounded-2xl border bg-card p-5 ${className}`}
    >
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span
          className={
            featured
              ? "text-[42px] font-bold leading-none tracking-tight"
              : "text-3xl font-bold leading-none tracking-tight"
          }
        >
          {value}
        </span>

        <span className="text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </div>
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
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>

        <span className="text-sm font-semibold">{count}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-[width]"
          style={{
            width: `${width}%`,
          }}
        />
      </div>
    </div>
  );
}
