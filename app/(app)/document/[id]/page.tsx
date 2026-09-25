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
import { getCapture } from "@/lib/services/captures";
import { getCompanies } from "@/lib/services/companies";
import {
  getDocumentationStatus,
  getMissingFields,
} from "@/lib/services/capture-completeness";
import { DeleteCaptureButton } from "@/components/document/delete-capture-button";

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
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {typeLabel}
              </span>

              {capture.source === "VOICE" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Voice
                </span>
              )}

              {status === "INCOMPLETE" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Missing information
                </span>
              )}

              {status === "UNCLASSIFIED" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Unclassified
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Documentation
            </h1>
          </div>

          <Link
            href={`/document/${capture.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <p className="whitespace-pre-wrap text-sm leading-7">
          {capture.text || "No documentation text."}
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
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
            value={`${capture.duration_minutes} minutes`}
          />
        )}

        {company && (
          <InfoItem icon={Building2} label="Company" value={company.name} />
        )}

        {capture.person_name && (
          <InfoItem
            icon={UserRound}
            label="Person"
            value={capture.person_name}
          />
        )}

        {capture.client_organization && (
          <InfoItem
            icon={Building2}
            label="Client organization"
            value={capture.client_organization}
          />
        )}
      </section>

      {Object.keys(details).length > 0 && (
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-medium">Details</h2>

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
        <section className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-medium">Missing information</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Add these details when you have them:
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {field}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="border-t pt-6">
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
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>

          <p className="mt-1 break-words text-sm font-medium">{value}</p>
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
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 whitespace-pre-wrap text-sm">{value}</p>
    </div>
  );
}
