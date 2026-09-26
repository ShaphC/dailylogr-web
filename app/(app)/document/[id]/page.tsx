import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Pencil,
  UserRound,
} from "lucide-react";
import { DeleteCaptureButton } from "@/components/document/delete-capture-button";
import {
  getDocumentationStatus,
  getMissingFields,
} from "@/lib/services/capture-completeness";
import { getCapture } from "@/lib/services/captures";
import { getCompanies } from "@/lib/services/companies";

const typeLabels: Record<string, string> = {
  WORK_DONE: "Work Done",
  CLIENT_VISIT: "Client Visit",
  TRAVEL: "Travel",
  EQUIPMENT: "Equipment",
  EXPENSE: "Expenses",
  GENERAL: "General",
};

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function formatTime(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDetailValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

export default async function CaptureDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  let capture;

  try {
    capture = await getCapture(id);
  } catch {
    notFound();
  }

  const companies = await getCompanies();

  const company =
    companies.find((item) => item.id === capture.company_id) ?? null;

  const status = getDocumentationStatus(capture);
  const missingFields = getMissingFields(capture);

  const typeLabel = capture.capture_type
    ? (typeLabels[capture.capture_type] ?? capture.capture_type)
    : "Unclassified";

  const startTime = formatTime(capture.start_time);
  const endTime = formatTime(capture.end_time);

  const details = capture.type_details ?? {};

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{typeLabel}</span>

              {capture.source === "VOICE" && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  Voice
                </span>
              )}

              {status === "INCOMPLETE" && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  Missing information
                </span>
              )}

              {status === "UNCLASSIFIED" && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  Unclassified
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/document/${capture.id}/edit`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <Pencil className="size-4" />
            Edit
          </Link>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
        <p className="whitespace-pre-wrap text-base leading-7">
          {capture.text || "No documentation text."}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Information</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem
            icon={CalendarDays}
            label="Date"
            value={formatDate(capture.capture_date)}
          />

          <InfoItem
            icon={Clock3}
            label="Time"
            value={
              startTime && endTime
                ? `${startTime} – ${endTime}`
                : (startTime ?? "Not specified")
            }
          />

          {capture.duration_minutes !== null && (
            <InfoItem
              icon={Clock3}
              label="Duration"
              value={`${capture.duration_minutes} ${
                capture.duration_minutes === 1 ? "minute" : "minutes"
              }`}
            />
          )}

          {company && (
            <InfoItem icon={Building2} label="Company" value={company.name} />
          )}

          {capture.person_name && (
            <InfoItem
              icon={UserRound}
              label="Client"
              value={capture.person_name}
            />
          )}

          {capture.client_organization && (
            <InfoItem
              icon={Building2}
              label="Client company"
              value={capture.client_organization}
            />
          )}
        </div>
      </section>

      {Object.keys(details).length > 0 && (
        <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-xl font-bold tracking-tight">Details</h2>

          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {capture.capture_type === "CLIENT_VISIT" && (
              <>
                <Detail
                  label="Starting location"
                  value={formatDetailValue(details.startingLocation)}
                />

                <Detail
                  label="Destination"
                  value={formatDetailValue(details.destination)}
                />

                <Detail
                  label="Visit details"
                  value={formatDetailValue(details.visitDetails)}
                  wide
                />
              </>
            )}

            {capture.capture_type === "TRAVEL" && (
              <>
                <Detail
                  label="Starting location"
                  value={formatDetailValue(details.startingLocation)}
                />

                <Detail
                  label="Destination"
                  value={formatDetailValue(details.destination)}
                />

                <Detail
                  label="Departure time"
                  value={formatDetailValue(details.departureTime)}
                />

                <Detail
                  label="Arrival time"
                  value={formatDetailValue(details.arrivalTime)}
                />

                <Detail
                  label="Return departure"
                  value={formatDetailValue(details.returnDepartureTime)}
                />

                <Detail
                  label="Return arrival"
                  value={formatDetailValue(details.returnArrivalTime)}
                />

                <Detail
                  label="Mileage"
                  value={formatDetailValue(details.mileage)}
                />

                <Detail
                  label="External reference"
                  value={formatDetailValue(details.externalReference)}
                />
              </>
            )}

            {capture.capture_type === "EQUIPMENT" && (
              <>
                <Detail
                  label="Equipment"
                  value={formatDetailValue(details.equipmentName)}
                />

                <Detail
                  label="Quantity"
                  value={formatDetailValue(details.quantity)}
                />

                <Detail
                  label="Action"
                  value={formatDetailValue(details.action)}
                />

                <Detail
                  label="Location"
                  value={formatDetailValue(details.location)}
                />

                <Detail
                  label="Details"
                  value={formatDetailValue(details.details)}
                  wide
                />
              </>
            )}

            {capture.capture_type === "EXPENSE" && (
              <>
                <Detail
                  label="Amount"
                  value={formatDetailValue(details.amount)}
                />

                <Detail
                  label="Receipt reference"
                  value={formatDetailValue(details.receiptReference)}
                />

                <Detail
                  label="Description"
                  value={formatDetailValue(details.description)}
                  wide
                />
              </>
            )}
          </div>
        </section>
      )}

      {missingFields.length > 0 && (
        <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-xl font-bold tracking-tight">
            Missing information
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add these details when you have them.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {field}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 border-t pt-6">
        <DeleteCaptureButton captureId={capture.id} />
      </section>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card">
          <Icon className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>

          <p className="mt-1 break-words text-sm font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string | null;
  wide?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6">{value}</p>
    </div>
  );
}
