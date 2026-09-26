import Link from "next/link";
import { ArrowRight, CircleAlert, FileText, Plus } from "lucide-react";
import { HistoryFilters } from "@/components/history/history-filters";
import {
  getDocumentationStatus,
  getMissingFields,
} from "@/lib/services/capture-completeness";
import { getCompanies } from "@/lib/services/companies";
import { getDocumentation } from "@/lib/services/documentation";
import {
  getHistoryDateRange,
  type HistoryPeriod,
} from "@/lib/services/history-filters";
import type { DocCompany, DocumentationItem } from "@/lib/types";

const typeLabels: Record<string, string> = {
  WORK_DONE: "Work Done",
  CLIENT_VISIT: "Client Visit",
  EQUIPMENT: "Equipment",
  TRAVEL: "Travel",
  EXPENSE: "Expenses",
  GENERAL: "General",
};

const validPeriods = new Set<HistoryPeriod>([
  "all",
  "today",
  "week",
  "month",
  "custom",
]);

function normalizePeriod(value: string | undefined): HistoryPeriod {
  if (value && validPeriods.has(value as HistoryPeriod)) {
    return value as HistoryPeriod;
  }

  return "all";
}

function normalizeDate(value: string | undefined) {
  if (!value) {
    return "";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  return value;
}

function formatDateHeading(dateKey: string) {
  const today = new Date();

  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  if (dateKey === formatLocalDateKey(today)) {
    return "Today";
  }

  if (dateKey === formatLocalDateKey(yesterday)) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    company?: string;
    type?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;

  const period = normalizePeriod(params.period);

  const companyId = params.company ?? "";

  const captureType = params.type ?? "";

  const customFrom = normalizeDate(params.from);

  const customTo = normalizeDate(params.to);

  const { fromDate, toDate } = getHistoryDateRange(
    period,
    customFrom,
    customTo,
  );

  const [documentation, companies] = await Promise.all([
    getDocumentation({
      companyId: companyId || null,
      fromDate,
      toDate,
    }),
    getCompanies(),
  ]);

  let filteredDocumentation = documentation;

  if (captureType) {
    filteredDocumentation = documentation.filter((item) => {
      if (captureType === "UNCLASSIFIED") {
        return item.kind === "capture" && !item.capture?.capture_type;
      }

      if (item.kind === "capture") {
        return item.capture?.capture_type === captureType;
      }

      return item.entry?.category === captureType;
    });
  }

  const companyMap = getCompanyMap(companies);

  const groups = groupDocumentation(filteredDocumentation);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History</h1>

          <p className="mt-1 text-[15px] text-muted-foreground">
            Browse everything you&apos;ve documented.
          </p>
        </div>

        <Link
          href="/document"
          className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
        >
          <Plus className="size-4" />
          Document
        </Link>
      </header>

      <section className="mt-7 rounded-2xl border bg-card p-4 sm:p-5">
        <HistoryFilters
          companies={companies}
          period={period}
          companyId={companyId}
          captureType={captureType}
          fromDate={customFrom}
          toDate={customTo}
        />
      </section>

      <section className="mt-9">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Documentation</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {filteredDocumentation.length}{" "}
              {filteredDocumentation.length === 1 ? "item" : "items"}
            </p>
          </div>

          <Link
            href="/document"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:hidden"
          >
            <Plus className="size-4" />
            Document
          </Link>
        </div>

        {filteredDocumentation.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-8">
            {groups.map(([date, items]) => (
              <div key={date}>
                <h3 className="mb-3 text-xs font-semibold text-muted-foreground">
                  {formatDateHeading(date)}
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <HistoryCard
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

function HistoryCard({
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

    const time =
      formatTime(capture.start_time) ?? formatTime(capture.created_at);

    return (
      <Link
        href={`/document/${capture.id}`}
        className="group block rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {typeLabel}
            </span>

            {time && (
              <span className="text-xs text-muted-foreground">{time}</span>
            )}

            {capture.source === "VOICE" && (
              <span className="text-xs text-muted-foreground">Voice</span>
            )}
          </div>

          <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
        </div>

        <p className="mt-3 whitespace-pre-wrap text-base leading-6">
          {capture.text || "No documentation text"}
        </p>

        {(companyName ||
          capture.person_name ||
          capture.client_organization) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {companyName && <span>{companyName}</span>}

            {capture.person_name && <span>Client: {capture.person_name}</span>}

            {capture.client_organization && (
              <span>{capture.client_organization}</span>
            )}
          </div>
        )}

        {status === "INCOMPLETE" && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <CircleAlert className="size-3" />
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

    const time = formatTime(entry.created_at);

    const category =
      typeLabels[entry.category] ?? entry.category ?? "Documentation";

    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {category}
          </span>

          {time && (
            <span className="text-xs text-muted-foreground">{time}</span>
          )}
        </div>

        <p className="mt-3 whitespace-pre-wrap text-base leading-6">
          {entry.text || entry.notes || "No documentation text"}
        </p>

        {companyName && (
          <p className="mt-3 text-xs text-muted-foreground">{companyName}</p>
        )}
      </div>
    );
  }

  return null;
}

function EmptyHistory() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <FileText className="size-5 text-muted-foreground" />

      <h3 className="mt-4 text-base font-semibold">No documentation found</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Nothing matches the current filters.
      </p>
    </div>
  );
}
