export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export function getMonthStartDateKey(date = new Date()) {
  return formatDateKey(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function getMonthEndDateKey(date = new Date()) {
  return formatDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}
