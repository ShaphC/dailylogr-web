"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCapture } from "@/lib/services/captures";
import type { CaptureTypeDetails } from "@/lib/types";

function nullableString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function nullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export async function createManualCaptureAction(formData: FormData) {
  const text = nullableString(formData.get("text"));

  if (!text) {
    throw new Error("Documentation text is required.");
  }

  const captureDate = nullableString(formData.get("capture_date"));

  if (!captureDate) {
    throw new Error("Capture date is required.");
  }

  const captureType = nullableString(formData.get("capture_type"));

  const startTime = nullableString(formData.get("start_time"));
  const endTime = nullableString(formData.get("end_time"));

  const typeDetails: CaptureTypeDetails = {};

  switch (captureType) {
    case "CLIENT_VISIT":
      typeDetails.startingLocation =
        nullableString(formData.get("starting_location")) ?? undefined;
      typeDetails.destination =
        nullableString(formData.get("destination")) ?? undefined;
      typeDetails.visitDetails =
        nullableString(formData.get("visit_details")) ?? undefined;
      break;

    case "TRAVEL":
      typeDetails.startingLocation =
        nullableString(formData.get("starting_location")) ?? undefined;
      typeDetails.destination =
        nullableString(formData.get("destination")) ?? undefined;
      typeDetails.departureTime =
        nullableString(formData.get("departure_time")) ?? undefined;
      typeDetails.arrivalTime =
        nullableString(formData.get("arrival_time")) ?? undefined;
      typeDetails.returnDepartureTime =
        nullableString(formData.get("return_departure_time")) ?? undefined;
      typeDetails.returnArrivalTime =
        nullableString(formData.get("return_arrival_time")) ?? undefined;
      typeDetails.mileage =
        nullableNumber(formData.get("mileage")) ?? undefined;
      typeDetails.externalReference =
        nullableString(formData.get("external_reference")) ?? undefined;
      break;

    case "EQUIPMENT":
      typeDetails.equipmentName =
        nullableString(formData.get("equipment_name")) ?? undefined;
      typeDetails.quantity =
        nullableNumber(formData.get("quantity")) ?? undefined;
      typeDetails.action =
        nullableString(formData.get("equipment_action")) ?? undefined;
      typeDetails.location =
        nullableString(formData.get("location")) ?? undefined;
      typeDetails.details =
        nullableString(formData.get("details")) ?? undefined;
      break;

    case "EXPENSE":
      typeDetails.amount = nullableNumber(formData.get("amount")) ?? undefined;
      typeDetails.description =
        nullableString(formData.get("description")) ?? undefined;
      typeDetails.receiptReference =
        nullableString(formData.get("receipt_reference")) ?? undefined;
      break;
  }

  await createCapture({
    capture_date: captureDate,
    start_time: startTime,
    end_time: endTime,
    duration_minutes: nullableNumber(formData.get("duration_minutes")),
    company_id: nullableString(formData.get("company_id")),
    capture_type: captureType,
    person_name: nullableString(formData.get("person_name")),
    client_organization: nullableString(formData.get("client_organization")),
    type_details: Object.keys(typeDetails).length > 0 ? typeDetails : null,
    text,
    source: "MANUAL",
  });

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/progress");

  redirect("/");
}
