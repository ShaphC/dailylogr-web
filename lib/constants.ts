import type { CaptureType } from "./types";

export const CAPTURE_TYPES: CaptureType[] = [
  "WORK_DONE",
  "CLIENT_VISIT",
  "TRAVEL",
  "EQUIPMENT",
  "EXPENSE",
  "GENERAL",
];

export const CAPTURE_TYPE_LABELS: Record<CaptureType, string> = {
  WORK_DONE: "Work Done",
  CLIENT_VISIT: "Client Visit",
  TRAVEL: "Travel",
  EQUIPMENT: "Equipment",
  EXPENSE: "Expenses",
  GENERAL: "General",
};

export const EQUIPMENT_ACTIONS = [
  "Installed",
  "Removed",
  "Serviced",
  "Inspected",
  "Other",
] as const;

export const DOCUMENTATION_STATUS_LABELS = {
  UNCLASSIFIED: "Unclassified",
  INCOMPLETE: "Incomplete",
  COMPLETE: "Complete",
} as const;
