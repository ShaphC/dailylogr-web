import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleHelp,
  MapPin,
  Package,
  Receipt,
  Route,
} from "lucide-react";
import {
  getMonthEndDateKey,
  getMonthStartDateKey,
} from "@/lib/services/date-range";
import { getDocumentation } from "@/lib/services/documentation";
import { getDocumentationMetrics } from "@/lib/services/metrics";
import { getDocumentationStreak } from "@/lib/services/streak";
import { getCompanies } from "@/lib/services/companies";
import {
  getDocumentationStatus,
  getMissingFields,
} from "@/lib/services/capture-completeness";
import type { DocCompany, DocumentationItem } from "@/lib/types";

const typeLabels: Record<string, string> = {
  WORK_DONE: "Work Done",
  CLIENT_VISIT: "Client Visit",
  EQUIPMENT: "Equipment",
  TRAVEL: "Travel",
  EXPENSE: "Expenses",
  GENERAL: "General",
};

function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateHeading(dateKey: string) {
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const todayKey = formatLocalDateKey(today);
  const yesterdayKey = formatLocalDateKey(yesterday);

  if (dateKey === todayKey) {
    return "Today";
  }

  if (dateKey === yesterdayKey) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) {
    return null;
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}

function formatCaptureTime(item: DocumentationItem) {
  if (item.kind !== "capture" || !item.capture) {
    return null;
  }

  const capture = item.capture;

  const start = formatTime(capture.start_time);
  const end = formatTime(capture.end_time);

  if (start && end) {
    return `${start} – ${end}`;
  }

  if (start) {
    return start;
  }

  return formatDuration(capture.duration_minutes);
}

function getCompanyMap(companies: DocCompany[]) {
  return new Map(companies.map((company) => [company.id, company.name]));
}

function groupDocumentation(documentation: DocumentationItem[]) {
  const groups = new Map<string, DocumentationItem[]>();

  for (const item of documentation) {
    const existing = groups.get(item.date) ?? [];

    existing.push(item);
    groups.set(item.date, existing);
  }

  return Array.from(groups.entries());
}

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default async function HomePage() {
  const fromDate = getMonthStartDateKey();
  const toDate = getMonthEndDateKey();

  const [metrics, streak, documentation, companies] = await Promise.all([
    getDocumentationMetrics({
      fromDate,
      toDate,
    }),
    getDocumentationStreak(),
    getDocumentation(),
    getCompanies(),
  ]);

  const recentDocumentation = documentation.slice(0, 10);

  const companyMap = getCompanyMap(companies);

  const groupedDocumentation = groupDocumentation(recentDocumentation);

  const metricItems = [
    {
      label: "Work Done",
      value: metrics.workDone,
      icon: BriefcaseBusiness,
      featured: true,
    },
    {
      label: "Unclassified",
      value: metrics.unclassified,
      icon: CircleHelp,
      featured: true,
    },
    {
      label: "Client Visits",
      value: metrics.clientVisits,
      icon: MapPin,
      featured: false,
    },
    {
      label: "Equipment",
      value: metrics.equipment,
      icon: Package,
      featured: false,
    },
    {
      label: "Travel",
      value: metrics.travel,
      icon: Route,
      featured: false,
    },
    {
      label: "Expenses",
      value: metrics.expenses,
      icon: Receipt,
      featured: false,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DailyLogr</h1>

          <p className="mt-1 text-[15px] text-muted-foreground">
            {getCurrentMonthLabel()}
          </p>
        </div>
      </header>

      <section className="mt-6">
        <Link
          href="/progress"
          className="group flex items-center justify-between gap-6 rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40"
        >
          <div>
            <p className="text-[13px] text-muted-foreground">Current Streak</p>

            <p className="mt-1 text-3xl font-bold tracking-tight">
              {streak}
              <span className="ml-1 text-base font-medium">
                {streak === 1 ? "day" : "days"}
              </span>
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
            View Progress
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {metricItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`flex flex-col justify-between rounded-2xl border bg-card p-4 ${
                  item.featured
                    ? "min-h-36 lg:min-h-32"
                    : "min-h-28 lg:min-h-32"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex items-center justify-center rounded-xl bg-primary/10 text-primary ${
                      item.featured ? "h-10 w-10 lg:h-9 lg:w-9" : "h-9 w-9"
                    }`}
                  >
                    <Icon
                      className={
                        item.featured
                          ? "h-[18px] w-[18px] lg:h-4 lg:w-4"
                          : "h-4 w-4"
                      }
                    />
                  </div>

                  <span
                    className={`font-semibold tracking-tight ${
                      item.featured ? "text-3xl lg:text-2xl" : "text-2xl"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>

                <p
                  className={`mt-4 text-muted-foreground ${
                    item.featured
                      ? "text-[15px] font-medium lg:text-sm lg:font-normal"
                      : "text-sm"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">
            Recent Documentation
          </h2>

          <Link
            href="/history"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            See All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentDocumentation.length === 0 ? (
          <EmptyDocumentation />
        ) : (
          <div className="space-y-7">
            {groupedDocumentation.map(([date, items]) => (
              <div key={date}>
                <p className="mb-3 text-xs font-semibold text-muted-foreground">
                  {formatDateHeading(date)}
                </p>

                <div className="space-y-3">
                  {items.map((item) => (
                    <DocumentationCard
                      key={`${item.kind}-${item.id}`}
                      item={item}
                      companyName={
                        item.companyId
                          ? (companyMap.get(item.companyId) ?? null)
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DocumentationCard({
  item,
  companyName,
}: {
  item: DocumentationItem;
  companyName: string | null;
}) {
  if (item.kind === "capture" && item.capture) {
    const capture = item.capture;

    const status = getDocumentationStatus(capture);

    const missingFields = getMissingFields(capture);

    const typeLabel = capture.capture_type
      ? (typeLabels[capture.capture_type] ?? capture.capture_type)
      : "Unclassified";

    const captureTime = formatCaptureTime(item);

    return (
      <Link
        href={`/document/${capture.id}`}
        className="group block rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-semibold text-muted-foreground">
            {typeLabel}
          </span>

          <div className="flex shrink-0 items-center gap-3">
            {capture.source === "VOICE" && (
              <span className="text-xs text-muted-foreground">Voice</span>
            )}

            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-base leading-6">
          {capture.text || "No capture text yet."}
        </p>

        {(companyName ||
          capture.person_name ||
          capture.client_organization ||
          captureTime) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {companyName && <span>{companyName}</span>}

            {capture.person_name && <span>{capture.person_name}</span>}

            {capture.client_organization && (
              <span>{capture.client_organization}</span>
            )}

            {captureTime && <span>{captureTime}</span>}
          </div>
        )}

        {status === "INCOMPLETE" && (
          <div className="mt-3">
            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
              Missing information
            </span>

            {missingFields.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Missing: {missingFields.join(", ")}
              </p>
            )}
          </div>
        )}
      </Link>
    );
  }

  if (item.entry) {
    const entry = item.entry;

    const category =
      typeLabels[entry.category] ?? entry.category ?? "Documentation";

    const time = formatTime(entry.created_at);

    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-semibold text-muted-foreground">
            {category}
          </span>

          {time && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {time}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-base leading-6">
          {entry.text || entry.notes || "No description yet."}
        </p>

        {companyName && (
          <p className="mt-3 text-xs text-muted-foreground">{companyName}</p>
        )}
      </div>
    );
  }

  return null;
}

function EmptyDocumentation() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-base font-semibold">Nothing documented yet</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Document something that happened and it will appear here.
      </p>

      <Link
        href="/document"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Document something
      </Link>
    </div>
  );
}
