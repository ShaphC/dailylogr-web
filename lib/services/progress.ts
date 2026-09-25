import { getDocumentation } from "@/lib/services/documentation";
import type { DocumentationItem } from "@/lib/types";

export interface ProgressTypeCount {
  type: string;
  label: string;
  count: number;
}

export interface ProgressCompanyCount {
  companyId: string | null;
  count: number;
}

export interface ProgressDay {
  date: string;
  count: number;
}

export interface ProgressData {
  currentStreak: number;
  thisMonthCount: number;
  activeDaysThisMonth: number;
  typeCounts: ProgressTypeCount[];
  companyCounts: ProgressCompanyCount[];
  last30Days: ProgressDay[];
}

const typeLabels: Record<string, string> = {
  WORK_DONE: "Work Done",
  CLIENT_VISIT: "Client Visits",
  EQUIPMENT: "Equipment",
  TRAVEL: "Travel",
  EXPENSE: "Expenses",
  GENERAL: "General",
  UNCLASSIFIED: "Unclassified",
};

const typeOrder = [
  "WORK_DONE",
  "CLIENT_VISIT",
  "EQUIPMENT",
  "TRAVEL",
  "EXPENSE",
  "GENERAL",
  "UNCLASSIFIED",
];

export async function getProgressData(
  companyId?: string | null,
): Promise<ProgressData> {
  const documentation = await getDocumentation({
    companyId: companyId || null,
  });

  const today = startOfLocalDay(new Date());

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthStartKey = formatDateKey(monthStart);

  const todayKey = formatDateKey(today);

  const thisMonthItems = documentation.filter(
    (item) => item.date >= monthStartKey && item.date <= todayKey,
  );

  const activeMonthDates = new Set(thisMonthItems.map((item) => item.date));

  return {
    currentStreak: calculateCurrentStreak(documentation, today),

    thisMonthCount: thisMonthItems.length,

    activeDaysThisMonth: activeMonthDates.size,

    typeCounts: calculateTypeCounts(documentation),

    companyCounts: calculateCompanyCounts(documentation),

    last30Days: calculateLast30Days(documentation, today),
  };
}

function calculateCurrentStreak(
  documentation: DocumentationItem[],
  today: Date,
) {
  const activeDates = new Set(documentation.map((item) => item.date));

  if (activeDates.size === 0) {
    return 0;
  }

  let cursor = new Date(today);

  /*
   * If today has no documentation,
   * allow the streak to continue
   * from yesterday.
   *
   * This avoids showing 0 first
   * thing in the morning when the
   * user documented yesterday.
   */
  if (!activeDates.has(formatDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (activeDates.has(formatDateKey(cursor))) {
    streak += 1;

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculateTypeCounts(documentation: DocumentationItem[]) {
  const counts = new Map<string, number>();

  for (const type of typeOrder) {
    counts.set(type, 0);
  }

  for (const item of documentation) {
    if (item.kind !== "capture" || !item.capture) {
      continue;
    }

    const type = item.capture.capture_type || "UNCLASSIFIED";

    if (!counts.has(type)) {
      continue;
    }

    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return typeOrder.map((type) => ({
    type,
    label: typeLabels[type] ?? type,
    count: counts.get(type) ?? 0,
  }));
}

function calculateCompanyCounts(documentation: DocumentationItem[]) {
  const counts = new Map<string | null, number>();

  for (const item of documentation) {
    const companyId = item.companyId ?? null;

    counts.set(companyId, (counts.get(companyId) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([companyId, count]) => ({
      companyId,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateLast30Days(documentation: DocumentationItem[], today: Date) {
  const counts = new Map<string, number>();

  for (const item of documentation) {
    counts.set(item.date, (counts.get(item.date) ?? 0) + 1);
  }

  const days: ProgressDay[] = [];

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today);

    date.setDate(date.getDate() - offset);

    const dateKey = formatDateKey(date);

    days.push({
      date: dateKey,
      count: counts.get(dateKey) ?? 0,
    });
  }

  return days;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
