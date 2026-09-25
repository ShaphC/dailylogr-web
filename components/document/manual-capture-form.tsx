"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  createManualCaptureAction,
  updateManualCaptureAction,
} from "@/app/(app)/document/actions";
import type { DocCapture, DocCompany } from "@/lib/types";

interface ManualCaptureFormProps {
  companies: DocCompany[];
  capture?: DocCapture;
}

const captureTypes = [
  { value: "", label: "Not classified" },
  { value: "WORK_DONE", label: "Work Done" },
  { value: "CLIENT_VISIT", label: "Client Visit" },
  { value: "TRAVEL", label: "Travel" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "EXPENSE", label: "Expenses" },
  { value: "GENERAL", label: "General" },
];

const equipmentActions = [
  "Installed",
  "Removed",
  "Serviced",
  "Inspected",
  "Other",
];

function getLocalDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLocalTime() {
  return formatTimeInput(new Date());
}

function formatTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getTimeFromIso(value: string | null) {
  if (!value) {
    return "";
  }

  return formatTimeInput(new Date(value));
}

function calculateDuration(startTime: string, endTime: string) {
  if (!startTime || !endTime) {
    return "";
  }

  const [startHour, startMinute] = startTime.split(":").map(Number);

  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = startHour * 60 + startMinute;

  let end = endHour * 60 + endMinute;

  if (end < start) {
    end += 24 * 60;
  }

  return String(end - start);
}

function calculateEndTime(startTime: string, duration: string) {
  if (!startTime || !duration) {
    return "";
  }

  const durationMinutes = Number(duration);

  if (!Number.isFinite(durationMinutes) || durationMinutes < 0) {
    return "";
  }

  const [hour, minute] = startTime.split(":").map(Number);

  const totalMinutes = hour * 60 + minute + durationMinutes;

  const normalizedMinutes = totalMinutes % (24 * 60);

  const endHour = Math.floor(normalizedMinutes / 60);

  const endMinute = normalizedMinutes % 60;

  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(
    2,
    "0",
  )}`;
}

function buildDateTime(date: string, time: string, nextDay = false) {
  if (!date || !time) {
    return "";
  }

  const value = new Date(`${date}T${time}:00`);

  if (nextDay) {
    value.setDate(value.getDate() + 1);
  }

  return value.toISOString();
}

function isEndNextDay(startTime: string, endTime: string) {
  if (!startTime || !endTime) {
    return false;
  }

  return endTime < startTime;
}

export function ManualCaptureForm({
  companies,
  capture,
}: ManualCaptureFormProps) {
  const isEditing = Boolean(capture);

  const [captureDate, setCaptureDate] = useState(
    capture?.capture_date ?? getLocalDate(),
  );

  const [startTime, setStartTime] = useState(
    getTimeFromIso(capture?.start_time ?? null) ||
      (capture ? "" : getLocalTime()),
  );

  const [endTime, setEndTime] = useState(
    getTimeFromIso(capture?.end_time ?? null),
  );

  const [duration, setDuration] = useState(
    capture?.duration_minutes !== null &&
      capture?.duration_minutes !== undefined
      ? String(capture.duration_minutes)
      : "",
  );

  const [captureType, setCaptureType] = useState(capture?.capture_type ?? "");

  const calculatedDuration = useMemo(() => {
    if (startTime && endTime) {
      return calculateDuration(startTime, endTime);
    }

    return duration;
  }, [startTime, endTime, duration]);

  useEffect(() => {
    if (!startTime || !duration || endTime) {
      return;
    }

    const calculatedEnd = calculateEndTime(startTime, duration);

    if (calculatedEnd) {
      setEndTime(calculatedEnd);
    }
  }, [startTime, duration, endTime]);

  const endNextDay = isEndNextDay(startTime, endTime);

  const details = capture?.type_details ?? {};

  const cancelHref = capture ? `/document/${capture.id}` : "/document";

  return (
    <form
      action={isEditing ? updateManualCaptureAction : createManualCaptureAction}
      className="space-y-8"
    >
      {capture && <input type="hidden" name="capture_id" value={capture.id} />}

      <input
        type="hidden"
        name="start_time"
        value={buildDateTime(captureDate, startTime)}
      />

      <input
        type="hidden"
        name="end_time"
        value={buildDateTime(captureDate, endTime, endNextDay)}
      />

      <header>
        <Link
          href={cancelHref}
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />

          {isEditing ? "Documentation" : "Document"}
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          {isEditing ? "Edit documentation" : "Manual capture"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isEditing
            ? "Update anything that needs more detail."
            : "Write down what happened. Everything else is optional."}
        </p>
      </header>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">Context</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Organize where this work belongs.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company">
            <SelectWrapper>
              <select
                name="company_id"
                defaultValue={capture?.company_id ?? ""}
                className={selectClassName}
              >
                <option value="">No company</option>

                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </Field>

          <Field label="Type">
            <SelectWrapper>
              <select
                name="capture_type"
                value={captureType}
                onChange={(event) => {
                  setCaptureType(event.target.value);
                }}
                className={selectClassName}
              >
                {captureTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </Field>
        </div>

        <TypeFields captureType={captureType} details={details} />
      </section>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <label htmlFor="text" className="text-sm font-medium">
          What happened?
        </label>

        <textarea
          id="text"
          name="text"
          required
          autoFocus={!isEditing}
          rows={7}
          defaultValue={capture?.text ?? ""}
          placeholder="Document what happened..."
          className="mt-3 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">When</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add timing if it's useful.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date">
            <input
              type="date"
              name="capture_date"
              required
              value={captureDate}
              onChange={(event) => {
                setCaptureDate(event.target.value);
              }}
              className={inputClassName}
            />
          </Field>

          <Field label="Duration">
            <input
              type="number"
              name="duration_minutes"
              min="0"
              value={calculatedDuration}
              onChange={(event) => {
                setDuration(event.target.value);

                if (!event.target.value) {
                  setEndTime("");
                }
              }}
              readOnly={Boolean(startTime && endTime)}
              placeholder="Minutes"
              className={inputClassName}
            />
          </Field>

          <Field label="Start time">
            <input
              type="time"
              value={startTime}
              onChange={(event) => {
                setStartTime(event.target.value);
              }}
              className={inputClassName}
            />
          </Field>

          <Field label="End time">
            <input
              type="time"
              value={endTime}
              onChange={(event) => {
                setEndTime(event.target.value);
              }}
              className={inputClassName}
            />
          </Field>
        </div>

        {startTime && endTime && (
          <p className="text-xs text-muted-foreground">
            Duration calculated automatically: {calculatedDuration} minutes
            {endNextDay ? " · ends the next day" : ""}
          </p>
        )}
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">Client Info</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Optional details about the client this was for.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client">
            <input
              type="text"
              name="person_name"
              defaultValue={capture?.person_name ?? ""}
              placeholder="Optional"
              className={inputClassName}
            />
          </Field>

          <Field label="Client Company">
            <input
              type="text"
              name="client_organization"
              defaultValue={capture?.client_organization ?? ""}
              placeholder="Optional"
              className={inputClassName}
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {isEditing ? "Save changes" : "Save documentation"}
        </button>
      </div>
    </form>
  );
}

function TypeFields({
  captureType,
  details,
}: {
  captureType: string;
  details: DocCapture["type_details"];
}) {
  const values = details ?? {};

  switch (captureType) {
    case "CLIENT_VISIT":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Starting location">
            <input
              name="starting_location"
              defaultValue={String(values.startingLocation ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Destination">
            <input
              name="destination"
              defaultValue={String(values.destination ?? "")}
              className={inputClassName}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Visit details">
              <textarea
                name="visit_details"
                rows={4}
                defaultValue={String(values.visitDetails ?? "")}
                className={textareaClassName}
              />
            </Field>
          </div>
        </div>
      );

    case "TRAVEL":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Starting location">
            <input
              name="starting_location"
              defaultValue={String(values.startingLocation ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Destination">
            <input
              name="destination"
              defaultValue={String(values.destination ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Departure time">
            <input
              type="time"
              name="departure_time"
              defaultValue={String(values.departureTime ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Arrival time">
            <input
              type="time"
              name="arrival_time"
              defaultValue={String(values.arrivalTime ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Return departure">
            <input
              type="time"
              name="return_departure_time"
              defaultValue={String(values.returnDepartureTime ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Return arrival">
            <input
              type="time"
              name="return_arrival_time"
              defaultValue={String(values.returnArrivalTime ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Mileage">
            <input
              type="number"
              step="any"
              name="mileage"
              defaultValue={String(values.mileage ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="External reference">
            <input
              name="external_reference"
              defaultValue={String(values.externalReference ?? "")}
              className={inputClassName}
            />
          </Field>
        </div>
      );

    case "EQUIPMENT":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Equipment">
            <input
              name="equipment_name"
              defaultValue={String(values.equipmentName ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              step="any"
              name="quantity"
              defaultValue={String(values.quantity ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Action">
            <SelectWrapper>
              <select
                name="equipment_action"
                defaultValue={String(values.action ?? "")}
                className={selectClassName}
              >
                <option value="">Select action</option>

                {equipmentActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </Field>

          <Field label="Location">
            <input
              name="location"
              defaultValue={String(values.location ?? "")}
              className={inputClassName}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Details">
              <textarea
                name="details"
                rows={4}
                defaultValue={String(values.details ?? "")}
                className={textareaClassName}
              />
            </Field>
          </div>
        </div>
      );

    case "EXPENSE":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Amount">
            <input
              type="number"
              step="0.01"
              name="amount"
              defaultValue={String(values.amount ?? "")}
              className={inputClassName}
            />
          </Field>

          <Field label="Receipt reference">
            <input
              name="receipt_reference"
              defaultValue={String(values.receiptReference ?? "")}
              className={inputClassName}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                name="description"
                rows={4}
                defaultValue={String(values.description ?? "")}
                className={textareaClassName}
              />
            </Field>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      {children}
    </label>
  );
}

function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

const inputClassName =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 read-only:cursor-default read-only:opacity-70";

const selectClassName =
  "h-11 w-full appearance-none rounded-xl border bg-background px-3 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const textareaClassName =
  "w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
