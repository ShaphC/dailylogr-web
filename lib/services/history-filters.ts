export type HistoryPeriod = "all" | "today" | "week" | "month" | "custom";

export function getHistoryDateRange(
  period: HistoryPeriod,
  customFrom?: string | null,
  customTo?: string | null,
) {
  const now = new Date();

  if (period === "all") {
    return {
      fromDate: null,
      toDate: null,
    };
  }

  if (period === "custom") {
    return {
      fromDate: customFrom || null,
      toDate: customTo || null,
    };
  }

  if (period === "today") {
    const today = formatDateKey(now);

    return {
      fromDate: today,
      toDate: today,
    };
  }

  if (period === "week") {
    const start = new Date(now);

    const day = start.getDay();
    const difference = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + difference);

    return {
      fromDate: formatDateKey(start),
      toDate: formatDateKey(now),
    };
  }

  return {
    fromDate: formatDateKey(new Date(now.getFullYear(), now.getMonth(), 1)),
    toDate: formatDateKey(now),
  };
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
