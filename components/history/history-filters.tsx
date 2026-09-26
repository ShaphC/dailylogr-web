"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import type { DocCompany } from "@/lib/types";

interface HistoryFiltersProps {
  companies: DocCompany[];
  period: string;
  companyId: string;
  captureType: string;
  fromDate: string;
  toDate: string;
}

const periods = [
  {
    value: "all",
    label: "All time",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "week",
    label: "This week",
  },
  {
    value: "month",
    label: "This month",
  },
  {
    value: "custom",
    label: "Custom range",
  },
];

const captureTypes = [
  {
    value: "",
    label: "All types",
  },
  {
    value: "UNCLASSIFIED",
    label: "Unclassified",
  },
  {
    value: "WORK_DONE",
    label: "Work Done",
  },
  {
    value: "CLIENT_VISIT",
    label: "Client Visit",
  },
  {
    value: "EQUIPMENT",
    label: "Equipment",
  },
  {
    value: "TRAVEL",
    label: "Travel",
  },
  {
    value: "EXPENSE",
    label: "Expenses",
  },
  {
    value: "GENERAL",
    label: "General",
  },
];

export function HistoryFilters({
  companies,
  period,
  companyId,
  captureType,
  fromDate,
  toDate,
}: HistoryFiltersProps) {
  const router = useRouter();

  function updateFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();

    router.push(query ? `/history?${query}` : "/history");
  }

  function changePeriod(value: string) {
    if (value === "all") {
      updateFilters({
        period: null,
        from: null,
        to: null,
      });

      return;
    }

    if (value !== "custom") {
      updateFilters({
        period: value,
        from: null,
        to: null,
      });

      return;
    }

    updateFilters({
      period: "custom",
    });
  }

  const hasFilters =
    period !== "all" ||
    Boolean(companyId) ||
    Boolean(captureType) ||
    Boolean(fromDate) ||
    Boolean(toDate);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FilterSelect label="Date" value={period} onChange={changePeriod}>
          {periods.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Company"
          value={companyId}
          onChange={(value) => {
            updateFilters({
              company: value || null,
            });
          }}
        >
          <option value="">All companies</option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Type"
          value={captureType}
          onChange={(value) => {
            updateFilters({
              type: value || null,
            });
          }}
        >
          {captureTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </FilterSelect>
      </div>

      {period === "custom" && (
        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />

            <p className="text-sm font-semibold">Custom date range</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-muted-foreground">
                From
              </span>

              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => {
                  updateFilters({
                    from: event.target.value || null,
                  });
                }}
                className={dateClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-muted-foreground">
                To
              </span>

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => {
                  updateFilters({
                    to: event.target.value || null,
                  });
                }}
                className={dateClassName}
              />
            </label>
          </div>

          {!fromDate && !toDate && (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Choose a start date, an end date, or both.
            </p>
          )}
        </div>
      )}

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            router.push("/history");
          }}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative block min-h-16 rounded-xl border bg-card px-3 py-2.5">
      <span className="block text-[10px] font-medium text-muted-foreground">
        {label}
      </span>

      <div className="relative mt-1">
        <select
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className="h-6 w-full cursor-pointer appearance-none bg-transparent pr-7 text-[13px] font-bold outline-none"
        >
          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}

const dateClassName =
  "h-12 w-full rounded-xl border bg-card px-3.5 text-sm outline-none transition-colors focus:border-foreground";
