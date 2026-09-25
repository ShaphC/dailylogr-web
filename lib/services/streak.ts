import { getCaptures } from "@/lib/services/captures";
import { getEntries } from "@/lib/services/entries";

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export async function getDocumentationStreak(options?: {
  companyId?: string | null;
}) {
  const [captures, entries] = await Promise.all([
    getCaptures(options),
    getEntries(options),
  ]);

  const documentedDates = new Set<string>();

  for (const capture of captures) {
    documentedDates.add(capture.capture_date);
  }

  for (const entry of entries) {
    documentedDates.add(entry.entry_date);
  }

  if (documentedDates.size === 0) {
    return 0;
  }

  const today = new Date();
  const todayKey = toDateKey(today);

  let currentDate = today;

  if (!documentedDates.has(todayKey)) {
    currentDate = addDays(today, -1);

    if (!documentedDates.has(toDateKey(currentDate))) {
      return 0;
    }
  }

  let streak = 0;

  while (documentedDates.has(toDateKey(currentDate))) {
    streak += 1;
    currentDate = addDays(currentDate, -1);
  }

  return streak;
}
