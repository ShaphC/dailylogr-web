export interface DocCapture {
  id: string;
  user_id: string;
  capture_date: string;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  company_id: string | null;
  person_name: string | null;
  text: string | null;
  source: string;
  entry_id: string | null;
  created_at: string;
  updated_at: string;
  client_organization: string | null;
  capture_type: string | null;
  type_details: CaptureTypeDetails | null;
}

export interface DocCompany {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface DocEntry {
  id: string;
  user_id: string;
  company_id: string | null;
  mode: string;
  category: string;
  entry_date: string;
  text: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaptureTypeDetails {
  startingLocation?: string;
  destination?: string;
  visitDetails?: string;

  departureTime?: string;
  arrivalTime?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;

  mileage?: number | string;
  externalReference?: string;

  equipmentName?: string;
  quantity?: number | string;
  action?: string;
  location?: string;
  details?: string;

  amount?: number | string;
  description?: string;
  receiptReference?: string;

  [key: string]: unknown;
}

export type CaptureType =
  | "WORK_DONE"
  | "CLIENT_VISIT"
  | "TRAVEL"
  | "EQUIPMENT"
  | "EXPENSE"
  | "GENERAL";

export type DocumentationStatus = "UNCLASSIFIED" | "INCOMPLETE" | "COMPLETE";

export interface DocumentationItem {
  id: string;
  kind: "capture" | "entry";
  date: string;
  createdAt: string;
  updatedAt: string;
  text: string | null;
  companyId: string | null;
  captureType: string | null;
  source: string | null;
  capture?: DocCapture;
  entry?: DocEntry;
}
