import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
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
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

  const recentDocumentation = documentation.slice(0, 8);

  const companyMap = getCompanyMap(companies);

  const groupedDocumentation = groupDocumentation(recentDocumentation);

  const metricItems = [
    {
      label: "Work Done",
      value: metrics.workDone,
      icon: BriefcaseBusiness,
    },
    {
      label: "Client Visits",
      value: metrics.clientVisits,
      icon: MapPin,
    },
    {
      label: "Equipment",
      value: metrics.equipment,
      icon: Package,
    },
    {
      label: "Travel",
      value: metrics.travel,
      icon: Route,
    },
    {
      label: "Expenses",
      value: metrics.expenses,
      icon: Receipt,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section>
        <p className="text-sm text-muted-foreground">This month</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Your documentation
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Capture what you did. Build your history as you go.
        </p>
      </section>

      <section>
        <div className="inline-flex items-center gap-3 rounded-full border bg-card px-4 py-2.5">
          <span className="text-lg font-semibold">{streak}</span>

          <span className="text-sm text-muted-foreground">
            day{streak === 1 ? "" : "s"} documented
          </span>
        </div>
      </section>

      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metricItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-2xl border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-2xl font-semibold tracking-tight">
                    {item.value}
                  </span>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {metrics.unclassified > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CircleAlert className="h-4 w-4" />

            <span>
              {metrics.unclassified} unclassified{" "}
              {metrics.unclassified === 1 ? "capture" : "captures"}
            </span>
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Recent documentation
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest documented activity.
            </p>
          </div>

          <Link
            href="/history"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentDocumentation.length === 0 ? (
          <EmptyDocumentation />
        ) : (
          <div className="space-y-8">
            {groupedDocumentation.map(([date, items]) => (
              <div key={date}>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  {formatDateHeading(date)}
                </h3>

                <div className="overflow-hidden rounded-2xl border bg-card">
                  {items.map((item, index) => (
                    <DocumentationRow
                      key={`${item.kind}-${item.id}`}
                      item={item}
                      companyName={
                        item.companyId
                          ? (companyMap.get(item.companyId) ?? null)
                          : null
                      }
                      showBorder={index > 0}
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

function DocumentationRow({
  item,
  companyName,
  showBorder,
}: {
  item: DocumentationItem;
  companyName: string | null;
  showBorder: boolean;
}) {
  if (item.kind === "capture" && item.capture) {
    const capture = item.capture;

    const status = getDocumentationStatus(capture);

    const missingFields = getMissingFields(capture);

    const typeLabel = capture.capture_type
      ? (typeLabels[capture.capture_type] ?? capture.capture_type)
      : "Unclassified";

    const time =
      formatTime(capture.start_time) ?? formatTime(capture.created_at);

    return (
      <Link
        href={`/document/${capture.id}`}
        className={`group block p-4 transition-colors hover:bg-accent/40 sm:p-5 ${
          showBorder ? "border-t" : ""
        }`}
      >
        <div className="flex gap-4">
          <div className="w-16 shrink-0 pt-0.5">
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-primary">
                {typeLabel}
              </span>

              {capture.source === "VOICE" && (
                <span className="text-xs text-muted-foreground">Voice</span>
              )}

              {status === "INCOMPLETE" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  Missing information
                </span>
              )}
            </div>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {capture.text || "No documentation text"}
            </p>

            {(companyName ||
              capture.person_name ||
              capture.client_organization) && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {companyName && <span>{companyName}</span>}

                {capture.person_name && <span>{capture.person_name}</span>}

                {capture.client_organization && (
                  <span>{capture.client_organization}</span>
                )}
              </div>
            )}

            {missingFields.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Missing: {missingFields.join(", ")}
              </p>
            )}
          </div>

          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    );
  }

  if (item.entry) {
    const entry = item.entry;

    const time = formatTime(entry.created_at);

    const category =
      typeLabels[entry.category] ?? entry.category ?? "Legacy entry";

    return (
      <div className={`p-4 sm:p-5 ${showBorder ? "border-t" : ""}`}>
        <div className="flex gap-4">
          <div className="w-16 shrink-0 pt-0.5">
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-muted-foreground">
              {category}
            </span>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {entry.text || entry.notes || "No documentation text"}
            </p>

            {companyName && (
              <p className="mt-3 text-xs text-muted-foreground">
                {companyName}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function EmptyDocumentation() {
  return (
    <div className="rounded-2xl border bg-card px-6 py-12 text-center">
      <h3 className="font-medium">Nothing documented yet</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Capture something that happened today and it will appear here.
      </p>

      <Link
        href="/document"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Document something
      </Link>
    </div>
  );
}
