"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { createManualCaptureAction } from "@/app/(app)/document/actions";
import type { DocCompany } from "@/lib/types";

interface ManualCaptureFormProps {
  companies: DocCompany[];
}

const captureTypes = [
  {
    value: "",
    label: "Not classified",
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
    value: "TRAVEL",
    label: "Travel",
  },
  {
    value: "EQUIPMENT",
    label: "Equipment",
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
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
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

function buildDateTime(date: string, time: string) {
  if (!date || !time) {
    return "";
  }

  return new Date(`${date}T${time}:00`).toISOString();
}

export function ManualCaptureForm({ companies }: ManualCaptureFormProps) {
  const [captureDate, setCaptureDate] = useState(getLocalDate());

  const [startTime, setStartTime] = useState(getLocalTime());

  const [endTime, setEndTime] = useState("");

  const [duration, setDuration] = useState("");

  const [captureType, setCaptureType] = useState("");

  const calculatedDuration = useMemo(() => {
    if (!startTime || !endTime) {
      return duration;
    }

    return calculateDuration(startTime, endTime);
  }, [startTime, endTime, duration]);

  return (
    <form action={createManualCaptureAction} className="space-y-8">
      <input
        type="hidden"
        name="start_time"
        value={buildDateTime(captureDate, startTime)}
      />

      <input
        type="hidden"
        name="end_time"
        value={buildDateTime(captureDate, endTime)}
      />

      <header>
        <Link
          href="/document"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Document
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          Manual capture
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Write down what happened. Everything else is optional.
        </p>
      </header>

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <label htmlFor="text" className="text-sm font-medium">
          What happened?
        </label>

        <textarea
          id="text"
          name="text"
          required
          autoFocus
          rows={7}
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
          </p>
        )}
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">Context</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Optional details about who or what this was for.
          </p>
        </div>

        <Field label="Company">
          <SelectWrapper>
            <select
              name="company_id"
              defaultValue=""
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Person">
            <input
              type="text"
              name="person_name"
              placeholder="Optional"
              className={inputClassName}
            />
          </Field>

          <Field label="Client organization">
            <input
              type="text"
              name="client_organization"
              placeholder="Optional"
              className={inputClassName}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-medium">Classification</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Optional. You can organize this later.
          </p>
        </div>

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

        <TypeFields captureType={captureType} />
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/document"
          className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Save documentation
        </button>
      </div>
    </form>
  );
}

function TypeFields({ captureType }: { captureType: string }) {
  switch (captureType) {
    case "CLIENT_VISIT":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Starting location">
            <input name="starting_location" className={inputClassName} />
          </Field>

          <Field label="Destination">
            <input name="destination" className={inputClassName} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Visit details">
              <textarea
                name="visit_details"
                rows={4}
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
            <input name="starting_location" className={inputClassName} />
          </Field>

          <Field label="Destination">
            <input name="destination" className={inputClassName} />
          </Field>

          <Field label="Departure time">
            <input
              type="time"
              name="departure_time"
              className={inputClassName}
            />
          </Field>

          <Field label="Arrival time">
            <input type="time" name="arrival_time" className={inputClassName} />
          </Field>

          <Field label="Return departure">
            <input
              type="time"
              name="return_departure_time"
              className={inputClassName}
            />
          </Field>

          <Field label="Return arrival">
            <input
              type="time"
              name="return_arrival_time"
              className={inputClassName}
            />
          </Field>

          <Field label="Mileage">
            <input
              type="number"
              step="any"
              name="mileage"
              className={inputClassName}
            />
          </Field>

          <Field label="External reference">
            <input name="external_reference" className={inputClassName} />
          </Field>
        </div>
      );

    case "EQUIPMENT":
      return (
        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
          <Field label="Equipment">
            <input name="equipment_name" className={inputClassName} />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              step="any"
              name="quantity"
              className={inputClassName}
            />
          </Field>

          <Field label="Action">
            <SelectWrapper>
              <select
                name="equipment_action"
                defaultValue=""
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
            <input name="location" className={inputClassName} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Details">
              <textarea name="details" rows={4} className={textareaClassName} />
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
              className={inputClassName}
            />
          </Field>

          <Field label="Receipt reference">
            <input name="receipt_reference" className={inputClassName} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                name="description"
                rows={4}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      {children}
    </label>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
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
